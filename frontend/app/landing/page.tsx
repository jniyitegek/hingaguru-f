import Footer from '@/components/common/Footer';
import CtaSection from '@/components/common/CtaSection';
import Header from '@/components/common/Header';
import HomeFeatures from '@/components/sections/home/Features';
import HeroSection from '@/components/sections/home/Hero';

export default function HingaguruLanding() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <HeroSection />

            <HomeFeatures />

            <CtaSection />

            <Footer />
        </div>
    );
}