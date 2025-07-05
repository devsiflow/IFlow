import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'aos/dist/aos.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Cadastro from './pages/Sign-inPage.jsx';
import Login from './pages/LoginPage.jsx';



const router = createBrowserRouter([
  {
    path:"/home",
    element: <App />, 
  },

  {
    path:"/cadastro",
    element: <Cadastro />, 
  },
  {
    path:"/login",
    element: <Login />, 
  }
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
