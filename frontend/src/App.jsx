import "./index.css";
import HomePage from "./pages/HomePage";
import { useEffect } from "react";
import AOS from "aos";
import ScrollToTopButton from "./components/ScrollTopButton";
import AdminFloatingButton from "./components/AdminFloatingButton"; // ✅ novo

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
      <AdminFloatingButton /> {/* ✅ botão flutuante global */}
    </div>
  );
}

export default App;
