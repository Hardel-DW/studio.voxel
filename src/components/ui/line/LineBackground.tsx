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
        let timeoutId: NodeJS.Timeout;
        let isVisible = true;

        const handleVisibilityChange = () => {
            isVisible = !document.hidden;
            if (!isVisible) {
                clearTimeout(timeoutId);
                cancelAnimationFrame(animationFrameId);
                linesRef.current = [];
            } else {
                animate();
                createNewLine();
            }
        };

        const animate = () => {
            if (!isVisible) return;
            animateLines(ctx, canvas, linesRef.current);
            animationFrameId = requestAnimationFrame(animate);
        };

        const createNewLine = () => {
            if (!isVisible) return;
            const delay = Math.random() * 2000 + 500;
            const newLine = createLine(canvas.width, canvas.height);
            linesRef.current.push(newLine);
            timeoutId = setTimeout(createNewLine, delay);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        animate();
        createNewLine();

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
            clearTimeout(timeoutId);
        };
    }, []);

    return <canvas ref={canvasRef} className={`w-full h-full absolute inset-0 ${className ?? ""}`} />;
};

export default LineBackground;
