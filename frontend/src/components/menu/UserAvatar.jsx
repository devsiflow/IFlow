import { User } from "lucide-react";

export default function UserAvatar({ profileImage, profileImageSmall, profileName, onClick, size = "md" }) {
  const wH = size === "md" ? "w-9 h-9" : "w-16 h-16";
  const border = size === "md" ? "border" : "border-2";
  const commonClasses = `${wH} rounded-full ${border} border-white cursor-pointer transform transition-transform duration-300 hover:scale-110`;

  return (
    <div className="relative group inline-block">
      {profileImageSmall ? (
        <img src={profileImageSmall} alt="perfil" className={commonClasses} onClick={onClick} />
      ) : profileImage ? (
        <img src={profileImage} alt="perfil" className={commonClasses} onClick={onClick} />
      ) : (
        <div className={`${commonClasses} flex items-center justify-center`} onClick={onClick}>
          <User className={size === "md" ? "w-5 h-5" : "w-8 h-8 text-gray-300"} />
        </div>
      )}

      {/* Tooltip estilizado */}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-[-35px] bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
        {profileName}
      </span>
    </div>
  );
}
