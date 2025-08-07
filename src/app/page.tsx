import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import BrandIntroduction from '@/components/BrandIntroduction';
import HotProducts from '@/components/HotProducts';
import ActivityCarousel from '@/components/ActivityCarousel';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroBanner />
        <BrandIntroduction />
        <HotProducts />
        <ActivityCarousel />
      </main>
      <Footer />
    </div>
  );
}
