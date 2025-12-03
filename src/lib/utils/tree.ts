import type { IdentifierObject } from "@voxelio/breeze";

export interface TreeFolder {
    identifiers: IdentifierObject[];
    children: Map<string, TreeFolder>;
    count: number;
}

export function buildTree(identifiers: IdentifierObject[]): TreeFolder {
    const root: TreeFolder = {
        identifiers: [],
        children: new Map(),
        count: 0
    };

    for (const id of identifiers) {
        const parts = id.resource.split("/");
        const folders = [id.namespace, ...parts.slice(0, -1)];

        let current = root;
        for (const folder of folders) {
            if (!current.children.has(folder)) {
                current.children.set(folder, { identifiers: [], children: new Map(), count: 0 });
            }
            current = current.children.get(folder) ?? { identifiers: [], children: new Map(), count: 0 };
        }

        current.identifiers.push(id);
    }

    const calculateCount = (folder: TreeFolder): number => {
        let count = folder.identifiers.length;
        for (const child of folder.children.values()) {
            count += calculateCount(child);
        }
        folder.count = count;
        return count;
    };

    calculateCount(root);
    return root;
}

export function matchesPath(id: IdentifierObject, folderPath: string): boolean {
    if (!folderPath) return true;
    const elementPath = `${id.namespace}/${id.resource.split("/").slice(0, -1).join("/")}`;
    return elementPath === folderPath || elementPath.startsWith(`${folderPath}/`);
}
