import { useState } from "react";
import { Menu, X, Home, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", icon: <Home className="w-5 h-5" />, path: "/home" },
    { label: "Perfil", icon: <User className="w-5 h-5" />, path: "/user" },
    { label: "Sair", icon: <LogOut className="w-5 h-5" />, action: () => {
      localStorage.clear();
      navigate("/login");
    }},
  ];

  return (
    <div className="md:hidden fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center p-4 bg-green-800 text-white shadow-md">
        <span className="font-bold text-lg">Iflow</span>
        <button onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-md transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 space-y-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setOpen(false);
                if (item.path) navigate(item.path);
                if (item.action) item.action();
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-gray-800 rounded-md hover:bg-gray-100"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
