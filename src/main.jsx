import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "aos/dist/aos.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cadastro from "./pages/Sign-inPage.jsx";
import Login from "./pages/LoginPage.jsx";
import LandingPage from "./pages/LandingPages.jsx";
import MarkePlace from "./components/MarketPlace.jsx";
import CadastraItem from "./components/CadastrarItem.jsx";
import FoundItem from "./pages/FoundItem.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: <App />,
  },

  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/marketplace",
    element: <MarkePlace />,
  },
  {
    path: "/cadastroitem",
    element: <CadastraItem />,
  },
   {
    path: "/founditem",
    element: <FoundItem />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
    
  </StrictMode>
);
