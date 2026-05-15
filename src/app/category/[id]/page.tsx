import { getCategoryWithFiles, getCategories, isDemoMode } from "@/lib/drive";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryFilesGrid from "@/components/CategoryFilesGrid";
import BackButton from "@/components/BackButton";

export const revalidate = 60;

// Generate static paths for all categories
export async function generateStaticParams() {
    const categories = await getCategories();
    return categories.map((category) => ({
        id: category.id,
    }));
}

interface CategoryPageProps {
    params: Promise<{ id: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { id } = await params;
    const category = await getCategoryWithFiles(id);
    const demoMode = isDemoMode();

    if (!category) {
        return (
            <>
                <Header />
                <main className="main-content">
                    <div className="category-page container">
                        <BackButton />
                        <div className="category-hero">
                            <h1>Category Not Found</h1>
                            <p>The category you&apos;re looking for doesn&apos;t exist.</p>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="main-content">
                <div className="category-page container">
                    {/* Back button */}
                    <BackButton />

                    {/* Category Hero */}
                    <div className="category-hero">
                        <h1>{category.name}</h1>
                        <p>
                            {category.fileCount} project{category.fileCount !== 1 ? "s" : ""}{" "}
                            in this collection
                            {demoMode && " — Connect Google Drive to see actual files"}
                        </p>
                    </div>

                    {/* Files Grid */}
                    {category.files && category.files.length > 0 ? (
                        <CategoryFilesGrid
                            files={category.files}
                            categoryName={category.name}
                        />
                    ) : (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "80px 0",
                                color: "var(--text-tertiary)",
                            }}
                        >
                            <p>No files in this category yet.</p>
                            <p style={{ fontSize: "0.85rem", marginTop: "8px" }}>
                                Upload files to Google Drive and they&apos;ll appear here
                                automatically.
                            </p>
                        </div>
                    )}
                </div>

                {/* Demo mode banner */}
                {demoMode && (
                    <div className="demo-banner">
                        <div className="demo-banner-dot" />
                        Demo Mode — Add your Google Drive API key to .env.local
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}
