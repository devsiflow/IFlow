import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "aos/dist/aos.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cadastro from "./pages/Sign-inPage.jsx";
import Login from "./pages/LoginPage.jsx";
import MarkePlace from "./pages/MarketPlace.jsx";
import CadastraItem from "./pages/CadastrarItem.jsx";
import ValidarItem from "./pages/ValidarItem.jsx";
import ValidacaoConfirmada from "./pages/ValidacaoConfirmada.jsx";
import UserPage from "./pages/UserPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
    path: "/validacao",
    element: <ValidarItem />,
  },
  {
    path: "/validacaoConfirmada",
    element: <ValidacaoConfirmada />,
  },
  {
    path: "/perfil",
    element: <UserPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
