"use client";

import Link from "next/link";
import { Category } from "@/lib/drive";
import MagicCard from "@/components/MagicCard";

// Icon mapping for demo categories
const CATEGORY_ICONS: Record<string, string> = {
    "3D Product Design": "🎲",
    Branding: "✦",
    "Motion Graphics": "◉",
    "PixelCube Logo": "◆",
    "Social Media": "◇",
    "UI/UX Product Design": "⬡",
    "Web App": "⟐",
    "Youtube Thumbnails": "▣",
    "Youtube Videos": "▶",
};

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

interface CategoryTileProps {
    category: Category;
    index: number;
}

export default function CategoryTile({ category, index }: CategoryTileProps) {
    const icon = CATEGORY_ICONS[category.name] || "◈";
    const pattern = PATTERNS[index % PATTERNS.length];

    return (
        <MagicCard>
            <Link href={`/category/${category.id}`} className="tile">
                {/* Always show pattern as base */}
                <div className={`tile-pattern ${pattern}`} />

                {/* Overlay thumbnail if available */}
                {category.thumbnail && (
                    <div
                        className="tile-bg"
                        style={{ backgroundImage: `url(${category.thumbnail})` }}
                    />
                )}

                <div className="tile-gradient" />

                {/* Icon */}
                <div className="tile-icon">{icon}</div>

                {/* Content */}
                <div className="tile-content">
                    <span className="tile-category-label">Category</span>
                    <h3 className="tile-name">{category.name}</h3>
                    <div className="tile-meta">
                        <span className="tile-count">{category.fileCount} projects</span>
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
