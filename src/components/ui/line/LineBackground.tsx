import { useEffect, useRef } from "react";
import { animateLines, createLine, type Line } from "@/components/ui/line/LineAnimationUtils";

interface LineBackgroundProps {
    className?: string;
}

const LineBackground: React.FC<LineBackgroundProps> = ({ className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const linesRef = useRef<Line[]>([]);

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
        const animate = () => {
            animateLines(ctx, canvas, linesRef.current);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        let timeoutId: NodeJS.Timeout;
        const createNewLine = () => {
            const delay = Math.random() * 2000 + 500;
            const newLine = createLine(canvas.width, canvas.height);
            linesRef.current.push(newLine);
            timeoutId = setTimeout(createNewLine, delay);
        };
        createNewLine();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timeoutId);
        };
    }, []);

    return <canvas ref={canvasRef} className={`w-full h-full absolute inset-0 ${className ?? ""}`} />;
};

export default LineBackground;
