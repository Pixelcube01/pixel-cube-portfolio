"use client";

import Link from "next/link";
import { DriveFile } from "@/lib/drive";
import MagicCard from "@/components/MagicCard";

const FOLDER_ICONS = ["📁", "◇", "◆", "□", "△", "⬡", "◈", "✦", "⬢", "○"];

const PATTERNS = [
    "pattern-grid",
    "pattern-dots",
    "pattern-diagonal",
    "pattern-circles",
    "pattern-grid",
    "pattern-dots",
    "pattern-diagonal",
    "pattern-circles",
    "pattern-grid",
];

interface FolderTileProps {
    folder: DriveFile;
    index: number;
}

export default function FolderTile({ folder, index }: FolderTileProps) {
    const icon = FOLDER_ICONS[index % FOLDER_ICONS.length];
    const pattern = PATTERNS[index % PATTERNS.length];

    return (
        <MagicCard>
            <Link href={`/category/${folder.id}`} className="tile">
                <div className={`tile-pattern ${pattern}`} />
                <div className="tile-gradient" />

                {/* Icon */}
                <div className="tile-icon">{icon}</div>

                {/* Content */}
                <div className="tile-content">
                    <span className="tile-category-label">Folder</span>
                    <h3 className="tile-name">{folder.name}</h3>
                    <div className="tile-meta">
                        <span className="tile-count">Open folder</span>
                        <div className="tile-arrow">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M7 17L17 7" />
                                <path d="M7 7h10v10" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>
        </MagicCard>
    );
}
