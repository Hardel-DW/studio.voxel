"use client";

import { useEffect, useRef } from "react";
import { type Line, animateLines, createLine } from "./LineAnimationUtils";

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

        // Ajuster la taille du canvas
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Démarrer l'animation
        let animationFrameId: number;
        const animate = () => {
            animateLines(ctx, canvas, linesRef.current);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        // Créer de nouvelles lignes périodiquement
        const createNewLine = () => {
            const delay = Math.random() * 2000 + 500;
            const newLine = createLine(canvas.width, canvas.height);
            linesRef.current.push(newLine);

            setTimeout(createNewLine, delay);
        };
        createNewLine();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className={`w-full h-full absolute inset-0 ${className ?? ""}`} />;
};

export default LineBackground;
