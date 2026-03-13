"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="category-back"
            style={{ background: "none", border: "none", cursor: "pointer" }}
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
        </button>
    );
}
