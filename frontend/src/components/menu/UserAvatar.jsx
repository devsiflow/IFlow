import { User } from "lucide-react";

export default function UserAvatar({ profileImage, profileImageSmall, onClick, size = "md" }) {
  const wH = size === "md" ? "w-9 h-9" : "w-16 h-16";
  const border = size === "md" ? "border" : "border-2";

  if (profileImageSmall) {
    return <img src={profileImageSmall} alt="perfil" className={`${wH} rounded-full ${border} border-white cursor-pointer transform transition-transform duration-300 hover:scale-110`} onClick={onClick} />;
  }
  if (profileImage) {
    return <img src={profileImage} alt="perfil" className={`${wH} rounded-full ${border} border-white cursor-pointer transform transition-transform duration-300 hover:scale-110`} onClick={onClick} />;
  }
  return (
    <div className={`${wH} ${border} rounded-full border-white flex items-center justify-center cursor-pointer transform transition-transform duration-300 hover:scale-110`} onClick={onClick}>
      <User className={size === "md" ? "w-5 h-5" : "w-8 h-8 text-gray-300"} />
    </div>
  );
}
