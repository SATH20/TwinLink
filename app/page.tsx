import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import HomeRedirect from '@/components/HomeRedirect';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
      <HomeRedirect />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </main>
  );
}
