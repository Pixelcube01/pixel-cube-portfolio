"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    const demoMode = isDemoMode();
    const router = useRouter();

    // Separate folders from files
    const folders = files.filter(f => isFolder(f));
    const actualFiles = files.filter(f => !isFolder(f));

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

        // Use the thumbnailLink from Google Drive API — works for images, videos, and PDFs
        // Upscale from =s220 to =s800 for better quality
        const thumbnailSrc = file.thumbnailLink
            ? file.thumbnailLink.replace("=s220", "=s800")
            : getFileUrl(file.id); // fallback to proxy

        return (
            <div style={{ position: "relative", background: "#111", minHeight: "180px" }}>
                <img
                    src={thumbnailSrc}
                    alt={file.name}
                    loading="lazy"
                    style={{
                        width: "100%",
                        display: "block",
                        minHeight: "180px",
                        objectFit: "cover",
                    }}
                    onError={(e) => {
                        // Fallback: try the proxy URL if thumbnail fails
                        const target = e.currentTarget;
                        if (!target.dataset.retried) {
                            target.dataset.retried = "true";
                            target.src = getFileUrl(file.id);
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
                    }}>
                        PDF
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* ===== FOLDERS SECTION ===== */}
            {folders.length > 0 && (
                <div style={{ marginBottom: "32px" }}>
                    <div style={{
                        fontSize: "0.7rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.2em",
                        color: "var(--text-muted)",
                        marginBottom: "16px",
                        fontWeight: 600,
                    }}>
                        Folders ({folders.length})
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: "12px",
                    }}>
                        {folders.map((folder) => (
                            <div
                                key={folder.id}
                                onClick={() => router.push(`/category/${folder.id}`)}
                                style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "12px",
                                    padding: "20px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "14px",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border-hover)";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)";
                                    e.currentTarget.style.background = "var(--bg-card-hover)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.background = "var(--bg-card)";
                                }}
                            >
                                {/* Folder Icon */}
                                <div style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "10px",
                                    background: "rgba(255, 200, 50, 0.1)",
                                    border: "1px solid rgba(255, 200, 50, 0.15)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}>
                                    <svg
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="rgba(255, 200, 50, 0.6)"
                                        stroke="rgba(255, 200, 50, 0.8)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                                    </svg>
                                </div>
                                {/* Folder Name */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: "0.9rem",
                                        fontWeight: 500,
                                        color: "var(--text-primary)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}>
                                        {folder.name}
                                    </div>
                                    <div style={{
                                        fontSize: "0.7rem",
                                        color: "var(--text-muted)",
                                        marginTop: "2px",
                                    }}>
                                        Folder
                                    </div>
                                </div>
                                {/* Arrow */}
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--text-muted)"
                                    strokeWidth="2"
                                    style={{ flexShrink: 0 }}
                                >
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </div>
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
