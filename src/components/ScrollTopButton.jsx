import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      title="Voltar ao Topo"
      className="fixed bottom-6 right-6 bg-green-700 hover:bg-green-800 text-white p-3 rounded-full shadow-lg transition duration-300 z-50"
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}

export default ScrollToTopButton;
