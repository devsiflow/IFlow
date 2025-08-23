import { useEffect, useState } from "react";

export function useItens() {
  const [itens, setItens] = useState(() => {
    const stored = localStorage.getItem("itens");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("itens", JSON.stringify(itens));
  }, [itens]);

  function adicionarItem(novoItem) {
    setItens((prev) => [...prev, novoItem]);
  }

  return { itens, adicionarItem };
}
