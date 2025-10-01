import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import logo from "../../assets/logo.jpg";
import MenuDesktop from "./MenuDesktop";
import MenuMobile from "./MenuMobile";

export default function Menu() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageSmall, setProfileImageSmall] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const cachedPic = localStorage.getItem("profilePic");
        const cachedPicSmall = localStorage.getItem("profilePicSmall");
        const cachedName = localStorage.getItem("profileName");

        const { data: supData } = await supabase.auth.getUser();
        if (!supData?.user) {
          setUser(null);
          setProfileImage(null);
          setProfileImageSmall(null);
          return;
        }

        setUser({
          id: supData.user.id,
          name: cachedName || supData.user.user_metadata?.name || "Não informado",
          email: supData.user.email,
        });

        if (cachedPic) setProfileImage(cachedPic);
        if (cachedPicSmall) setProfileImageSmall(cachedPicSmall);

        const session = (await supabase.auth.getSession())?.data?.session;
        const token = session?.access_token;
        if (!token) return;

        const res = await fetch("https://iflow-zdbx.onrender.com/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const profile = await res.json();
          if (profile?.profilePic && profile.profilePic !== cachedPic) {
            setProfileImage(profile.profilePic);
            localStorage.setItem("profilePic", profile.profilePic);
          }
          if (profile?.profilePicSmall && profile.profilePicSmall !== cachedPicSmall) {
            setProfileImageSmall(profile.profilePicSmall);
            localStorage.setItem("profilePicSmall", profile.profilePicSmall);
          }
          if (profile?.name && profile.name !== cachedName) {
            setUser((u) => ({ ...u, name: profile.name }));
            localStorage.setItem("profileName", profile.name);
          }
        }
      } catch (err) {
        console.error("Menu error:", err);
      }
    };

    fetchUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      localStorage.removeItem("profilePic");
      localStorage.removeItem("profilePicSmall");
      localStorage.removeItem("profileName");
      fetchUser();
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <nav className="font-semibold fixed h-52 top-0 left-0 w-full text-white z-50 bg-[linear-gradient(to_bottom,rgb(0,0,0),rgba(0,0,0,0))]">
      <div className="flex items-center justify-between px-6 py-3">
        <img src={logo} alt="Logo" className="w-32 cursor-pointer" onClick={() => navigate("/")} />
        <MenuDesktop user={user} profileImage={profileImage} profileImageSmall={profileImageSmall} navigate={navigate} />
        <MenuMobile user={user} profileImage={profileImage} profileImageSmall={profileImageSmall} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
    </nav>
  );
}
