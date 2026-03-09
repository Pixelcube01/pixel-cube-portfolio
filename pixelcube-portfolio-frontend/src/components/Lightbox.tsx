"use client";

import { useState, useEffect, useCallback } from "react";
import { DriveFile, getFileUrl, getFileType } from "@/lib/drive";

interface LightboxProps {
    files: DriveFile[];
    currentIndex: number;
    onClose: () => void;
    isDemoMode?: boolean;
}

export default function Lightbox({
    files,
    currentIndex,
    onClose,
    isDemoMode = false,
}: LightboxProps) {
    const [index, setIndex] = useState(currentIndex);
    const file = files[index];

    const goNext = useCallback(() => {
        setIndex((prev) => (prev + 1) % files.length);
    }, [files.length]);

    const goPrev = useCallback(() => {
        setIndex((prev) => (prev - 1 + files.length) % files.length);
    }, [files.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, goNext, goPrev]);

    const fileType = getFileType(file.mimeType);

    // Generate varied aspect ratios for demo placeholder images
    const demoHeights = [400, 500, 350, 450, 550, 380, 480, 420, 520, 360];
    const demoHeight = demoHeights[index % demoHeights.length];

    return (
        <div
            className="lightbox-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Close button */}
            <button className="lightbox-close" onClick={onClose}>
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {/* Prev button */}
            {files.length > 1 && (
                <button className="lightbox-nav prev" onClick={goPrev}>
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
            )}

            {/* Content */}
            <div className="lightbox-content">
                {isDemoMode ? (
                    <div
                        style={{
                            width: "700px",
                            maxWidth: "90vw",
                            height: `${demoHeight}px`,
                            maxHeight: "80vh",
                            background: `linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)`,
                            borderRadius: "12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "16px",
                            color: "rgba(255,255,255,0.3)",
                        }}
                    >
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                            {file.name}
                        </span>
                        <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>
                            Connect Google Drive to see actual images
                        </span>
                    </div>
                ) : fileType === "video" ? (
                    <video
                        src={getFileUrl(file.id)}
                        controls
                        autoPlay
                        style={{ maxWidth: "90vw", maxHeight: "85vh" }}
                    />
                ) : (
                    <img
                        src={getFileUrl(file.id)}
                        alt={file.name}
                        style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain" }}
                    />
                )}
            </div>

            {/* Next button */}
            {files.length > 1 && (
                <button className="lightbox-nav next" onClick={goNext}>
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            )}

            {/* Info */}
            <div className="lightbox-info">
                <div className="lightbox-info-name">{file.name}</div>
                <div className="lightbox-info-counter">
                    {index + 1} / {files.length}
                </div>
            </div>
        </div>
    );
}
