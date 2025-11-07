import iflowlogo from "../assets/iflowlogopngwhite.png";
import Menu from "../components/menu/Menu";

// Importando as seções
import AboutSection from "../components/sections/AboutSection";
import HowItWorks from "../components/sections/HowItWorks";
import ObjectiveSection from "../components/sections/ObjectiveSection";
import Footer from "../components/sections/Footer";

import videoBackground from "../assets/videoBackground.mp4";

function HomePage() {
  return (
    <div className="dark:bg-gray-900 w-screen overflow-hidden">
      {/* Seção inicial com vídeo de fundo e logo */}
      <section
        className="h-screen w-screen relative overflow-hidden"
        data-aos="fade-in"
      >
        <Menu />

        {/* Vídeo de fundo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        >
          <source
          src={videoBackground}
            // src={"https://www.pexels.com/download/video/3288315/"}
            type="video/mp4"
          />
          Seu navegador não suporta vídeos HTML5.
        </video>

        {/* Logo centralizada */}
        <div className="flex items-center justify-center h-full">
          <img
            src={iflowlogo}
            alt="Logo da Vorti Sea"
            className="w-[27.2rem] md:w-[34rem] lg:w-[40.8rem] object-contain"
          />
        </div>
      </section>

      {/* Seções do site */}
      <AboutSection />
      <HowItWorks />
      <ObjectiveSection />
      <Footer />
    </div>
  );
}

export default HomePage;
