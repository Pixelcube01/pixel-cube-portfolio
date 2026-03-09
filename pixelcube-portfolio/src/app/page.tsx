import { getCategories, isDemoMode } from "@/lib/drive";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import CategoryTile from "@/components/CategoryTile";
import ContactSection from "@/components/ContactSection";

export const revalidate = 60;

export default async function Home() {
  const categories = await getCategories();
  const demoMode = isDemoMode();

  return (
    <>
      <Header />

      <main className="main-content">
        {/* Hero */}
        {/* <Hero /> */}

        {/* Categories Section */}
        <section className="categories-section" id="projects">
          <div className="container">
            <div className="section-header">
              <div>
                <div className="section-label">Portfolio</div>
                <h2 className="section-title">
                  Categories
                </h2>
              </div>
              <span className="section-count">
                {categories.length} categories
              </span>
            </div>

            <div className="category-grid">
              {categories.map((category, index) => (
                <CategoryTile
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        {/* <div className="container">
          <ContactSection />
        </div> */}
      </main>

      {/* Demo mode banner */}

      <Footer />
    </>
  );
}
