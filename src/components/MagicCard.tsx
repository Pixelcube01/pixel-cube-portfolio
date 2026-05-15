"use client";

import { useCallback, useRef, ReactNode } from "react";

interface MagicCardProps {
    children: ReactNode;
    className?: string;
    gradientSize?: number;
    gradientColor?: string;
    gradientOpacity?: number;
}

export default function MagicCard({
    children,
    className = "",
    gradientSize = 500,
    gradientColor = "#ffffff",
    gradientOpacity = 0.8,
}: MagicCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const card = cardRef.current;
            if (!card) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
            card.style.setProperty("--magic-opacity", "1");
        },
        []
    );

    const handleMouseLeave = useCallback(() => {
        const card = cardRef.current;
        if (!card) return;
        card.style.setProperty("--magic-opacity", "0");
    }, []);

    return (
        <div
            ref={cardRef}
            className={`magic-card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={
                {
                    "--gradient-size": `${gradientSize}px`,
                    "--gradient-color": gradientColor,
                    "--gradient-opacity": gradientOpacity,
                    "--magic-opacity": "0",
                } as React.CSSProperties
            }
        >
            {/* Spotlight gradient overlay */}
            <div className="magic-card-spotlight" />
            {/* Border glow overlay */}
            <div className="magic-card-border-glow" />
            {/* Content */}
            <div className="magic-card-content">{children}</div>
        </div>
    );
}
