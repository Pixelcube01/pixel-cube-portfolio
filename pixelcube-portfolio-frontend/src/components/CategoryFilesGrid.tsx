"use client";

import { useState } from "react";
import { DriveFile, getFileUrl, getFileThumbnail, getFilePreviewUrl, getFileType, isDemoMode } from "@/lib/drive";
import Lightbox from "@/components/Lightbox";

interface CategoryFilesGridProps {
    files: DriveFile[];
    categoryName: string;
}

// Generate varied visual properties for demo items
const DEMO_GRADIENTS = [
    "linear-gradient(135deg, #1a1a2e, #16213e)",
    "linear-gradient(135deg, #0f0f1a, #1a0a2e)",
    "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
    "linear-gradient(135deg, #0a1628, #1a2a3e)",
    "linear-gradient(135deg, #1a0a0a, #2e1a1a)",
    "linear-gradient(135deg, #0a1a0a, #1a2e1a)",
    "linear-gradient(135deg, #1a1a0a, #2e2e1a)",
    "linear-gradient(135deg, #0f0f0f, #1f1f2f)",
];

const DEMO_HEIGHTS = [280, 350, 220, 400, 300, 260, 380, 320, 240, 360];

const DEMO_ICONS = ["◇", "◆", "○", "□", "△", "▽", "⬡", "◈", "✦", "⬢"];

export default function CategoryFilesGrid({
    files,
    categoryName,
}: CategoryFilesGridProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const demoMode = isDemoMode();

    const renderFileContent = (file: DriveFile, index: number) => {
        if (demoMode) {
            const demoHeight = DEMO_HEIGHTS[index % DEMO_HEIGHTS.length];
            const demoGradient = DEMO_GRADIENTS[index % DEMO_GRADIENTS.length];
            const demoIcon = DEMO_ICONS[index % DEMO_ICONS.length];
            return (
                <div
                    style={{
                        width: "100%",
                        height: `${demoHeight}px`,
                        background: demoGradient,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        color: "rgba(255,255,255,0.15)",
                    }}
                >
                    <span style={{ fontSize: "2.5rem" }}>{demoIcon}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.05em" }}>
                        {file.name}
                    </span>
                </div>
            );
        }

        const fileType = getFileType(file.mimeType);

        if (fileType === "video") {
            return (
                <div style={{ position: "relative", background: "#111", minHeight: "250px" }}>
                    <iframe
                        src={getFilePreviewUrl(file.id)}
                        style={{
                            width: "100%",
                            height: "300px",
                            border: "none",
                            display: "block",
                        }}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        loading="lazy"
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: "12px",
                            left: "12px",
                            background: "rgba(0,0,0,0.7)",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                            color: "rgba(255,255,255,0.7)",
                            pointerEvents: "none",
                        }}
                    >
                        ▶ Video
                    </div>
                </div>
            );
        }

        if (fileType === "pdf") {
            return (
                <div
                    style={{
                        position: "relative",
                        background: "#111",
                        minHeight: "200px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        padding: "24px",
                    }}
                >
                    <img
                        src={getFileThumbnail(file.id)}
                        alt={file.name}
                        loading="lazy"
                        style={{ width: "100%", display: "block", borderRadius: "4px" }}
                        onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                                const fallback = document.createElement("div");
                                fallback.innerHTML = `
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5">
                                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                    </svg>
                                    <span style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-top:8px">PDF Document</span>
                                `;
                                fallback.style.cssText = "display:flex;flex-direction:column;align-items:center;padding:40px;";
                                parent.appendChild(fallback);
                            }
                        }}
                    />
                    <div
                        style={{
                            position: "absolute",
                            bottom: "12px",
                            right: "12px",
                            background: "rgba(255,59,48,0.8)",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            color: "#fff",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        PDF
                    </div>
                </div>
            );
        }

        // Default: image
        return (
            <img
                src={getFileUrl(file.id)}
                alt={file.name}
                loading="lazy"
                style={{ width: "100%", display: "block" }}
                onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.retried) {
                        target.dataset.retried = "true";
                        target.src = getFileThumbnail(file.id);
                    }
                }}
            />
        );
    };

    return (
        <>
            <div className="masonry-grid">
                {files.map((file, index) => {
                    const fileType = getFileType(file.mimeType);
                    return (
                        <div
                            key={file.id}
                            className="masonry-item"
                            onClick={() => {
                                if (fileType !== "video") {
                                    setLightboxIndex(index);
                                }
                            }}
                        >
                            {renderFileContent(file, index)}
                            <div className="masonry-item-overlay">
                                <span className="masonry-item-name">{file.name}</span>
                                <span className="masonry-item-type">{fileType}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {lightboxIndex !== null && (
                <Lightbox
                    files={files}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    isDemoMode={demoMode}
                />
            )}
        </>
    );
}
