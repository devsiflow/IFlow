import "./index.css";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import HomePage from "./components/HomePage";
import AboutSection from "./components/AboutSection";
import HowItWorks from "./components/HowItWorks";
import ObjectiveSection from "./components/ObjectiveSection";
import { useEffect } from 'react';
import AOS from 'aos';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: false,    
    });
  }, []);
  
  return (
    <div>
      <Menu />
      <HomePage />
      <AboutSection />
      <HowItWorks />
      <ObjectiveSection />
      <Footer />
    </div>
  );
}

export default App;
