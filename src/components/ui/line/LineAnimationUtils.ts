export interface Line {
    x: number;
    y: number;
    angle: number;
    speed: number;
    length: number;
    opacity: number;
    trail: { x: number; y: number; opacity: number }[];
    nextRotationTime: number;
}

export function createLine(width: number, height: number): Line {
    const startPosition = getRandomStartPosition(width, height);

    return {
        x: startPosition.x,
        y: startPosition.y,
        angle: startPosition.initialAngle,
        speed: 2 + Math.random() * 2,
        length: 50 + Math.random() * 100,
        opacity: 0,
        trail: [],
        nextRotationTime: Date.now() + (Math.random() * 2000 + 1000)
    };
}

function getRandomStartPosition(width: number, height: number) {
    const side = Math.floor(Math.random() * 4);

    switch (side) {
        case 0:
            return { x: Math.random() * width, y: 0, initialAngle: Math.PI / 2 };
        case 1:
            return { x: width, y: Math.random() * height, initialAngle: Math.PI };
        case 2:
            return { x: Math.random() * width, y: height, initialAngle: -Math.PI / 2 };
        default:
            return { x: 0, y: Math.random() * height, initialAngle: 0 };
    }
}

export function animateLines(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, lines: Line[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i];

        if (Date.now() >= line.nextRotationTime) {
            const currentAngle = Math.round(line.angle / (Math.PI / 2)) * (Math.PI / 2);
            const turnRight = Math.random() > 0.5;
            const rotation = turnRight ? Math.PI / 2 : -Math.PI / 2;
            line.angle = currentAngle + rotation;
            line.nextRotationTime = Date.now() + (Math.random() * 2000 + 1000);
        }

        line.x += Math.cos(line.angle) * line.speed;
        line.y += Math.sin(line.angle) * line.speed;
        line.opacity = Math.min(1, line.opacity + 0.02);
        line.trail.push({ x: line.x, y: line.y, opacity: line.opacity });
        if (line.trail.length > line.length) {
            line.trail.shift();
        }

        ctx.beginPath();
        ctx.lineWidth = 2;

        for (let j = 0; j < line.trail.length - 1; j++) {
            const point = line.trail[j];
            const nextPoint = line.trail[j + 1];
            const gradientOpacity = (j / line.trail.length) * point.opacity;

            ctx.strokeStyle = `rgba(220, 220, 220, ${gradientOpacity})`;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
        }

        // Vérifier si la ligne entière (y compris la traînée) est sortie de l'écran
        const isTrailOutside = line.trail.every(
            (point) => point.x < -50 || point.x > canvas.width + 50 || point.y < -50 || point.y > canvas.height + 50
        );

        if (isTrailOutside) {
            lines.splice(i, 1);
        }
    }
}
