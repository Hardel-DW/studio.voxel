abstract class BaseValidator {
    #optional = false;
    #description: string | undefined;
    #nullable = false;

    optional() {
        this.#optional = true;
        return this;
    }

    description(text: string) {
        this.#description = text;
        return this;
    }

    nullable() {
        this.#nullable = true;
        return this;
    }

    protected get isOptional() {
        return this.#optional;
    }

    protected get getDescription() {
        return this.#description;
    }

    protected get isNullable() {
        return this.#nullable;
    }

    abstract validate(value: unknown, key: string): unknown;
}

abstract class BaseMinMaxValidator extends BaseValidator {
    #min?: number;
    #max?: number;

    min(value: number) {
        this.#min = value;
        return this;
    }

    max(value: number) {
        this.#max = value;
        return this;
    }

    protected get getMin() {
        return this.#min;
    }

    protected get getMax() {
        return this.#max;
    }
}

class StringValidator extends BaseMinMaxValidator {
    validate(value: unknown, key: string): string | null | undefined {
        if (value === undefined) {
            if (!this.isOptional) {
                throw new Error(`Missing required field: ${key}${this.getDescription ? ` (${this.getDescription})` : ""}`);
            }
            return undefined;
        }

        if (value === null) {
            if (!this.isNullable) {
                throw new Error(`${key} cannot be null${this.getDescription ? ` (${this.getDescription})` : ""}`);
            }
            return null;
        }

        if (typeof value !== "string") {
            throw new Error(`Invalid type for ${key}: expected string${this.getDescription ? ` (${this.getDescription})` : ""}`);
        }

        if (this.getMin !== undefined && value.length < this.getMin) {
            throw new Error(`${key} must be at least ${this.getMin} characters${this.getDescription ? ` (${this.getDescription})` : ""}`);
        }

        if (this.getMax !== undefined && value.length > this.getMax) {
            throw new Error(`${key} must be at most ${this.getMax} characters${this.getDescription ? ` (${this.getDescription})` : ""}`);
        }

        return value;
    }
}

class NumberValidator extends BaseMinMaxValidator {
    validate(value: unknown, key: string): number | undefined {
        if (value === undefined || value === null) {
            if (!this.isOptional) {
                throw new Error(`Missing required field: ${key}${this.getDescription ? ` (${this.getDescription})` : ""}`);
            }
            return undefined;
        }

        if (typeof value !== "number") {
            throw new Error(`Invalid type for ${key}: expected number${this.getDescription ? ` (${this.getDescription})` : ""}`);
        }

        if (this.getMin !== undefined && value < this.getMin) {
            throw new Error(`${key} must be at least ${this.getMin}${this.getDescription ? ` (${this.getDescription})` : ""}`);
        }

        if (this.getMax !== undefined && value > this.getMax) {
            throw new Error(`${key} must be at most ${this.getMax}${this.getDescription ? ` (${this.getDescription})` : ""}`);
        }

        return value;
    }
}

class BooleanValidator extends BaseValidator {
    validate(value: unknown, key: string): boolean | undefined {
        if (value === undefined || value === null) {
            if (!this.isOptional) {
                throw new Error(`Missing required field: ${key}${this.getDescription ? ` (${this.getDescription})` : ""}`);
            }
            return undefined;
        }

        if (typeof value !== "boolean") {
            throw new Error(`Invalid type for ${key}: expected boolean${this.getDescription ? ` (${this.getDescription})` : ""}`);
        }

        return value;
    }
}

class ObjectValidator<T extends Record<string, Validator> = Record<string, never>> extends BaseValidator {
    #schema?: T;

    constructor(schema?: T) {
        super();
        this.#schema = schema;
    }

    parse(data: unknown): T extends Record<string, never> ? Record<string, unknown> : InferSchema<T> {
        if (typeof data !== "object" || data === null) {
            throw new Error("Data must be an object");
        }

        if (!this.#schema || Object.keys(this.#schema).length === 0) {
            return this.validate(data, "root") as T extends Record<string, never> ? Record<string, unknown> : InferSchema<T>;
        }

        const obj = data as Record<string, unknown>;
        const result: Record<string, unknown> = {};

        for (const [key, validator] of Object.entries(this.#schema)) {
            result[key] = validator.validate(obj[key], key);
        }

        return result as T extends Record<string, never> ? Record<string, unknown> : InferSchema<T>;
    }

    validate(value: unknown, key: string): Record<string, unknown> | undefined {
        if (value === undefined || value === null) {
            if (!this.isOptional) {
                throw new Error(`Missing required field: ${key}${this.getDescription ? ` (${this.getDescription})` : ""}`);
            }
            return undefined;
        }

        if (typeof value !== "object" || value === null) {
            throw new Error(`Invalid type for ${key}: expected object${this.getDescription ? ` (${this.getDescription})` : ""}`);
        }

        return value as Record<string, unknown>;
    }
}

class RecordValidator<V extends StringValidator | NumberValidator | BooleanValidator> extends BaseValidator {
    #valueValidator: V;

    constructor(valueValidator: V) {
        super();
        this.#valueValidator = valueValidator;
    }

    validate(value: unknown, key: string): Record<string, InferValidatorType<V>> | undefined {
        if (value === undefined || value === null) {
            if (!this.isOptional) {
                throw new Error(`Missing required field: ${key}${this.getDescription ? ` (${this.getDescription})` : ""}`);
            }
            return undefined;
        }

        if (typeof value !== "object" || value === null || Array.isArray(value)) {
            throw new Error(`Invalid type for ${key}: expected record${this.getDescription ? ` (${this.getDescription})` : ""}`);
        }

        const obj = value as Record<string, unknown>;
        const result: Record<string, unknown> = {};

        for (const [k, v] of Object.entries(obj)) {
            result[k] = this.#valueValidator.validate(v, `${key}.${k}`);
        }

        return result as Record<string, InferValidatorType<V>>;
    }
}

type Validator = StringValidator | NumberValidator | BooleanValidator | ObjectValidator | RecordValidator<any>;

type InferValidatorType<T extends Validator> = T extends StringValidator
    ? string
    : T extends NumberValidator
      ? number
      : T extends BooleanValidator
        ? boolean
        : T extends RecordValidator<infer V>
          ? V extends StringValidator | NumberValidator | BooleanValidator
              ? Record<string, InferValidatorType<V>>
              : never
          : T extends ObjectValidator
            ? Record<string, unknown>
            : never;

type InferSchema<T extends Record<string, Validator>> = {
    -readonly [K in keyof T]: InferValidatorType<T[K]>;
} & {};

function objectValidator(): ObjectValidator;
function objectValidator<T extends Record<string, Validator>>(schema: T): ObjectValidator<T>;
function objectValidator<T extends Record<string, Validator>>(schema?: T): ObjectValidator<T> | ObjectValidator {
    return new ObjectValidator(schema);
}

export const z = {
    string: () => new StringValidator(),
    number: () => new NumberValidator(),
    boolean: () => new BooleanValidator(),
    object: objectValidator,
    record: <V extends StringValidator | NumberValidator | BooleanValidator>(valueValidator: V) => new RecordValidator(valueValidator)
};
