import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EliteAgentsSection from "@/components/EliteAgentsSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <EliteAgentsSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
