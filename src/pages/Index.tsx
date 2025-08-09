
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import SimpleProductGrid from '@/components/SimpleProductGrid';
import RecommendedSection from '@/components/RecommendedSection';
import AnnouncementsSection from '@/components/AnnouncementsSection';
import SocialsSection from '@/components/SocialsSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
const Index = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* TEST: If you see this comment, the deployment is working */}
      <Header />
      <HeroSection />
      <SimpleProductGrid />
      <RecommendedSection />
      <AnnouncementsSection />
      <SocialsSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
