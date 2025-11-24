import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "aos/dist/aos.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Cadastro from "./pages/Sign-inPage.jsx";
import Login from "./pages/LoginPage.jsx";
import Catalogo from "./pages/Catalogo.jsx";
import CadastraItem from "./pages/CadastrarItem.jsx";
import ValidarItem from "./pages/ValidarItem.jsx";
import ValidacaoConfirmada from "./pages/ValidacaoConfirmada.jsx";
import ItensNaoEncontrados from "./pages/ItensNaoEncontrados.jsx";
import UserPage from "./pages/UserPage.jsx";
import ItemPage from "./pages/ItemPage.jsx";
import AdminPage from "./admin/AdminPage.jsx";
import SolicitacaoDetalhes from "./components/admin/SolicitacaoDetalhes.jsx"; 

import { ThemeProvider } from "./context/ThemeContext.jsx";
import AdminFloatingButton from "./components/AdminFloatingButton.jsx";

// eslint-disable-next-line react-refresh/only-export-components
function LayoutWrapper({ children }) {
  return (
    <>
      {children}
      <AdminFloatingButton />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LayoutWrapper>
        <App />
      </LayoutWrapper>
    ),
  },
  {
    path: "/home",
    element: (
      <LayoutWrapper>
        <App />
      </LayoutWrapper>
    ),
  },
  {
    path: "/catalogo",
    element: (
      <LayoutWrapper>
        <Catalogo />
      </LayoutWrapper>
    ),
  },
  {
    path: "/cadastroitem",
    element: (
      <LayoutWrapper>
        <CadastraItem />
      </LayoutWrapper>
    ),
  },
  {
    path: "/perfil",
    element: (
      <LayoutWrapper>
        <UserPage />
      </LayoutWrapper>
    ),
  },
  {
    path: "/itempage/:id",
    element: (
      <LayoutWrapper>
        <ItemPage />
      </LayoutWrapper>
    ),
  },
  {
    path: "/validacao/:id",
    element: (
      <LayoutWrapper>
        <ValidarItem />
      </LayoutWrapper>
    ),
  },
  {
    path: "/validacaoConfirmada",
    element: (
      <LayoutWrapper>
        <ValidacaoConfirmada />
      </LayoutWrapper>
    ),
  },
   {
    path: "/itens-perdidos",
    element: (
      <LayoutWrapper>
        <ItensNaoEncontrados />
      </LayoutWrapper>
    ),
  },

  // ================================
  //     ROTAS DO ADMIN
  // ================================
  {
    path: "/admin",
    element: <AdminPage />,
  },

  {
    path: "/admin/solicitacoes/:id",
    element: <SolicitacaoDetalhes />
  },

  { path: "/login", element: <Login /> },
  { path: "/cadastro", element: <Cadastro /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
