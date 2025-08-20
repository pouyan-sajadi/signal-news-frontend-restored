import React, { useEffect, useRef, useState } from 'react';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(1);

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        const heroHeight = heroRef.current.offsetHeight;
        // Calculate opacity based on scroll position
        // Starts fading out after scrolling 20% of its height, fully gone by 80%
        const fadeStart = heroHeight * 0.2;
        const fadeEnd = heroHeight * 0.8;

        if (scrollY < fadeStart) {
          setOpacity(1);
        } else if (scrollY > fadeEnd) {
          setOpacity(0);
        } else {
          const newOpacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
          setOpacity(newOpacity);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={heroRef}
      style={{ opacity: opacity }}
      className="relative flex items-center justify-center h-[50vh] md:h-[40vh] min-h-[350px] md:min-h-[300px] bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 text-white overflow-hidden transition-opacity duration-300 ease-out container mx-auto rounded-lg"
    >
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zm0 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM12 34v-4H10v4H6v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4H6v2h4v4h2V6h4V4h-4zm0 18v-4H10v4H6v2h4v4h2v-4h4v-2h-4z\'%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        backgroundSize: '30px 30px',
        transform: 'scale(2)' // Make the pattern larger
      }}></div>
      <div className="relative z-10 text-center px-4 max-w-3xl rounded-3xl p-4 sm:p-6 md:p-8 bg-white/10 backdrop-blur-sm shadow-2xl">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
          Signal News: Clarity in the Chaos
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-light mb-8">
          Unlock intelligent, noise-free, and easily digestible overviews of the tech landscape. Our LLM-powered search delivers nuanced, multi-angle reports in seconds, transforming how you understand the world.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => handleScrollToSection("dashboard-section")} className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-purple-700 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
            Explore the Dashboard
          </button>
          <button onClick={() => handleScrollToSection("top-search-section")} className="px-5 py-2.5 sm:px-6 sm:py-3 border border-white text-white rounded-full text-base sm:text-lg font-semibold hover:bg-white hover:text-purple-700 transition-colors shadow-lg">
            Generate Your Report
          </button>
        </div>
      </div>
    </div>
  );
}