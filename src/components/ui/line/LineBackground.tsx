import { useEffect, useRef } from "react";
import { animateLines, createLine, type Line } from "@/components/ui/line/LineAnimationUtils";

interface LineBackgroundProps {
    frequency?: number;
}

export default function LineBackground({ frequency = 1500 }: LineBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const linesRef = useRef<Line[]>([]);
    const lastFrameTimeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let animationFrameId: number;
        let timeoutId: ReturnType<typeof setTimeout>;

        const animate = (timestamp: number) => {
            if (document.hidden) return;
            if (lastFrameTimeRef.current && timestamp - lastFrameTimeRef.current > 100) {
                linesRef.current = [];
            }

            lastFrameTimeRef.current = timestamp;

            animateLines(ctx, canvas, linesRef.current);
            animationFrameId = requestAnimationFrame(animate);
        };

        const createNewLine = () => {
            if (document.hidden) return;

            const newLine = createLine(canvas.width, canvas.height);
            linesRef.current.push(newLine);
            scheduleNextLine();
        };

        const scheduleNextLine = () => {
            clearTimeout(timeoutId);
            if (document.hidden) return;
            const delay = frequency + (Math.random() * frequency - frequency / 2);
            timeoutId = setTimeout(createNewLine, delay);
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                clearTimeout(timeoutId);
                cancelAnimationFrame(animationFrameId);
            } else {
                lastFrameTimeRef.current = 0;
                linesRef.current = [];
                animationFrameId = requestAnimationFrame(animate);
                scheduleNextLine();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        animationFrameId = requestAnimationFrame(animate);
        scheduleNextLine();

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timeoutId);
        };
    }, [frequency]);

    return <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />;
}
