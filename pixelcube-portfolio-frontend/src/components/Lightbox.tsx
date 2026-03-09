"use client";

import { useState, useEffect, useCallback } from "react";
import { DriveFile, getFileUrl, getFileType, getFilePreviewUrl, getFileDownloadUrl } from "@/lib/drive";

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

    const renderContent = () => {
        if (isDemoMode) {
            return (
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
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>{file.name}</span>
                    <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>Connect Google Drive to see actual content</span>
                </div>
            );
        }

        // PDF Viewer — full-screen embedded Google Drive preview
        if (fileType === "pdf") {
            return (
                <div style={{
                    width: "90vw",
                    height: "85vh",
                    maxWidth: "1200px",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#1a1a1a",
                }}>
                    {/* PDF Toolbar */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 20px",
                        background: "rgba(255,255,255,0.05)",
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {/* PDF icon */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span style={{
                                fontSize: "0.85rem",
                                color: "var(--text-primary)",
                                fontWeight: 500,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "500px",
                            }}>
                                {file.name}
                            </span>
                        </div>
                        {/* Download button */}
                        <a
                            href={getFileDownloadUrl(file.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "6px 14px",
                                borderRadius: "6px",
                                background: "rgba(255,255,255,0.1)",
                                color: "var(--text-secondary)",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                textDecoration: "none",
                                transition: "all 0.2s",
                                border: "1px solid rgba(255,255,255,0.1)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                                e.currentTarget.style.color = "#fff";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                e.currentTarget.style.color = "var(--text-secondary)";
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                            Download
                        </a>
                    </div>
                    {/* PDF Embed */}
                    <iframe
                        src={getFilePreviewUrl(file.id)}
                        style={{
                            flex: 1,
                            width: "100%",
                            border: "none",
                        }}
                        allow="autoplay"
                        loading="lazy"
                        title={file.name}
                    />
                </div>
            );
        }

        // Video — embedded Google Drive preview
        if (fileType === "video") {
            return (
                <div style={{
                    width: "90vw",
                    maxWidth: "1000px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#000",
                }}>
                    <iframe
                        src={getFilePreviewUrl(file.id)}
                        style={{
                            width: "100%",
                            height: "56.25vw",
                            maxHeight: "80vh",
                            border: "none",
                        }}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        loading="lazy"
                        title={file.name}
                    />
                </div>
            );
        }

        // Default: Image
        return (
            <img
                src={getFileUrl(file.id)}
                alt={file.name}
                style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain" }}
            />
        );
    };

    return (
        <div
            className="lightbox-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Close button */}
            <button className="lightbox-close" onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>

            {/* Prev button */}
            {files.length > 1 && (
                <button className="lightbox-nav prev" onClick={goPrev}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
            )}

            {/* Content */}
            <div className="lightbox-content">
                {renderContent()}
            </div>

            {/* Next button */}
            {files.length > 1 && (
                <button className="lightbox-nav next" onClick={goNext}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
