

import HomePage from "./pages/HomePage";

import { useEffect } from "react";
import AOS from "aos";
import ScrollToTopButton from "./components/ScrollTopButton";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <div>
      <HomePage />
      <ScrollToTopButton />
    </div>
  );
}

export default App;
