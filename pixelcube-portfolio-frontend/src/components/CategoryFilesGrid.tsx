"use client";

import { useState, useCallback } from "react";
import FolderTile from "@/components/FolderTile";
import { DriveFile, getFileUrl, getFileThumbnail, getFilePreviewUrl, getFileType, isFolder, isDemoMode } from "@/lib/drive";
import Lightbox from "@/components/Lightbox";

interface CategoryFilesGridProps {
    files: DriveFile[];
    categoryName: string;
}

// Demo visual properties
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
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const demoMode = isDemoMode();

    // Separate folders from files
    const folders = files.filter(f => isFolder(f));
    const actualFiles = files.filter(f => !isFolder(f));

    const handleImageLoad = useCallback((fileId: string) => {
        setLoadedImages(prev => {
            const next = new Set(prev);
            next.add(fileId);
            return next;
        });
    }, []);

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
        const isLoaded = loadedImages.has(file.id);

        // Use the thumbnailLink from Google Drive API — works for images, videos, and PDFs
        // Upscale from =s220 to =s800 for better quality
        const thumbnailSrc = file.thumbnailLink
            ? file.thumbnailLink.replace("=s220", "=s800")
            : getFileUrl(file.id); // fallback to proxy

        return (
            <div style={{ position: "relative", background: "#111", minHeight: "180px" }}>
                {/* Skeleton shimmer — visible while image loads */}
                {!isLoaded && (
                    <div
                        className="skeleton"
                        style={{
                            position: "absolute",
                            inset: 0,
                            minHeight: "180px",
                            borderRadius: 0,
                            zIndex: 1,
                        }}
                    />
                )}
                <img
                    src={thumbnailSrc}
                    alt={file.name}
                    loading="lazy"
                    style={{
                        width: "100%",
                        display: "block",
                        minHeight: "180px",
                        objectFit: "cover",
                        opacity: isLoaded ? 1 : 0,
                        transition: "opacity 0.4s ease",
                    }}
                    onLoad={() => handleImageLoad(file.id)}
                    onError={(e) => {
                        // Fallback: try the proxy URL if thumbnail fails
                        const target = e.currentTarget;
                        if (!target.dataset.retried) {
                            target.dataset.retried = "true";
                            target.src = getFileUrl(file.id);
                        } else {
                            // If proxy also fails, show the image anyway (remove skeleton)
                            handleImageLoad(file.id);
                        }
                    }}
                />
                {/* Video badge */}
                {fileType === "video" && (
                    <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                        zIndex: 2,
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                    </div>
                )}
                {/* PDF badge */}
                {fileType === "pdf" && (
                    <div style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        background: "rgba(255,59,48,0.85)",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        color: "#fff",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        pointerEvents: "none",
                        zIndex: 2,
                    }}>
                        PDF
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* ===== FOLDERS SECTION (Tile Layout) ===== */}
            {folders.length > 0 && (
                <div style={{ marginBottom: "48px" }}>
                    <div className="category-grid">
                        {folders.map((folder, index) => (
                            <FolderTile
                                key={folder.id}
                                folder={folder}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ===== FILES SECTION ===== */}
            {actualFiles.length > 0 && (
                <div>
                    {folders.length > 0 && (
                        <div style={{
                            fontSize: "0.7rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.2em",
                            color: "var(--text-muted)",
                            marginBottom: "16px",
                            fontWeight: 600,
                        }}>
                            Files ({actualFiles.length})
                        </div>
                    )}
                    <div className="masonry-grid">
                        {actualFiles.map((file, index) => {
                            const fileType = getFileType(file.mimeType);
                            return (
                                <div
                                    key={file.id}
                                    className="masonry-item"
                                    onClick={() => {
                                        setLightboxIndex(index);
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
                </div>
            )}

            {/* Empty state */}
            {folders.length === 0 && actualFiles.length === 0 && (
                <div style={{
                    textAlign: "center",
                    padding: "80px 0",
                    color: "var(--text-tertiary)",
                }}>
                    <p>This folder is empty.</p>
                </div>
            )}

            {/* Lightbox for files only */}
            {lightboxIndex !== null && (
                <Lightbox
                    files={actualFiles}
                    currentIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                    isDemoMode={demoMode}
                />
            )}
        </>
    );
}
