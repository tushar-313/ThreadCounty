import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero";
import { FeaturesSection } from "@/components/landing/features";
import { WorkflowSection } from "@/components/landing/workflow";
import { TestimonialsSection, StatsSection } from "@/components/landing/testimonials";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <WorkflowSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
