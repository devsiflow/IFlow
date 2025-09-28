import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "aos/dist/aos.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Cadastro from "./pages/Sign-inPage.jsx";
import Login from "./pages/LoginPage.jsx";
import BancoItens from "./pages/BancoItems.jsx";
import CadastraItem from "./pages/CadastrarItem.jsx";
import ValidarItem from "./pages/ValidarItem.jsx";
import ValidacaoConfirmada from "./pages/ValidacaoConfirmada.jsx";
import UserPage from "./pages/UserPage.jsx";
import ItemPage from "./pages/ItemPage.jsx";

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
    path: "/bancoitens",
    element: <BancoItens />,
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
   {
    path: "/paginaitem",
    element: <ItemPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
