import MenuMarketPlace from "./MenuMarketPlace";
import React from "react";

const items = [
  {
    id: 1,
    name: "Livro",
    date: "30/10/2025",
    status: "Perdido",
    image: "",
  },
    {
    id: 1,
    name: "Livro",
    date: "30/10/2025",
    status: "Perdido",
    image: "",
  },
    {
    id: 1,
    name: "Livro",
    date: "30/10/2025",
    status: "Perdido",
    image: "",
  },
    {
    id: 1,
    name: "Livro",
    date: "30/10/2025",
    status: "Perdido",
    image: "",
  },
    {
    id: 1,
    name: "Livro",
    date: "30/10/2025",
    status: "Perdido",
    image: "",
  },
    {
    id: 1,
    name: "Livro",
    date: "30/10/2025",
    status: "Perdido",
    image: "",
  },
    {
    id: 1,
    name: "Livro",
    date: "30/10/2025",
    status: "Perdido",
    image: "",
  },
];

function MarkePlace() {
  return (
    <div>
      <MenuMarketPlace />
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm bg-white">
              <img src={item.image} alt={item.image} className="w-full h-40 object-contain p-2" ></img>
              <div className="p-4 bg-gray-100">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-600">Data: {item.date}</p>
                <span className="inline-block mt-1 px-2 py-1 text-xs text-white bg-red-500 rounded"> {item.status} </span>
                <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                  É meu
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MarkePlace;
