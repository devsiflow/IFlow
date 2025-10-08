# 🌀 IFLOW – Fluxo Inteligente de Achados e Perdidos

> **Uma plataforma moderna, segura e sustentável para gerenciar achados e perdidos em ambientes escolares.**

---

## 📖 Sobre o Projeto

O **IFLOW** nasceu com o propósito de **digitalizar e modernizar** o processo de achados e perdidos nas escolas, especialmente nos Institutos Federais.  
O sistema centraliza todo o fluxo — do registro do item encontrado até sua devolução — de forma **rápida, segura e intuitiva**, promovendo **responsabilidade social, sustentabilidade e engajamento comunitário.**

💡 O projeto foi desenvolvido como **Trabalho de Conclusão de Curso (TCC)** pelos alunos **Jackson, Leandro e João Vitor**, do curso **Técnico Integrado em Informática**, no Instituto Federal.

---

## 🚀 Principais Funcionalidades

- 📸 **Cadastro completo de itens** com foto, descrição, categoria e local de achado.  
- 🔎 **Busca com filtros avançados** (por nome, categoria, local e status).  
- 🧑‍💻 **Autenticação segura** via [Supabase Auth](https://supabase.com/).  
- 🧭 **Painel administrativo** para gerenciamento e validação de itens.  
- 🤖 **IA de validação** — geração de perguntas inteligentes para confirmar a propriedade do item.  
- 🌱 **Sustentabilidade** — itens não reclamados podem ser destinados à doação.  
- ⭐ **Sistema de reputação** que incentiva e reconhece a devolução de objetos.  

---

## 🧰 Tecnologias Utilizadas

### 🖥️ Frontend
- [React.js](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)

### ⚙️ Backend
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Supabase](https://supabase.com/)

---

## 🧪 Metodologia

O desenvolvimento seguiu uma **abordagem incremental e ágil**, permitindo testar e ajustar o sistema continuamente com **feedback real de usuários**.  
Essa metodologia garantiu **melhorias constantes**, **redução de falhas** e uma **experiência de uso mais confiável e fluida.**

---

## 🖼️ Demonstração

> _(Adicione aqui prints ou GIFs do sistema em funcionamento)_

Exemplo:
```bash
📁 Página inicial — listagem de itens encontrados
🔍 Filtros — busca por nome, categoria e local
🧾 Detalhes do item — descrição e contato para devolução
```

---

## 🧩 Estrutura do Projeto

```
iflow/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── lib/
│   │   └── prisma/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── assets/
│   └── main.jsx
│
└── README.md
```

---

## 🧑‍💼 Autores

👨‍💻 **Jackson Silva**  
👨‍💻 **Leandro Souza**  
👨‍💻 **João Vitor Lima**

Orientação: **Prof. [Nome do Orientador]**

---

## 🏁 Como Executar o Projeto

### 🔧 Pré-requisitos
- Node.js >= 18  
- PostgreSQL  
- Conta no Supabase (para Auth e DB, se desejar)

### ▶️ Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/iflow.git

# Acesse o diretório
cd iflow

# Instale as dependências
npm install

# Configure as variáveis de ambiente (.env)

# Rode o backend
cd backend
npm run dev

# Rode o frontend
cd ../frontend
npm run dev
```

Acesse o projeto em **http://localhost:5173**

---

## 💬 Impacto e Legado

O **IFLOW** representa mais do que um sistema: é um **movimento de transformação digital e cidadania**, fortalecendo o senso de comunidade, **incentivando a honestidade** e **reduzindo o desperdício de recursos**.  
Com ele, cada item devolvido é uma pequena vitória pela **confiança e colaboração** dentro do ambiente escolar.

---

## 🪪 Licença

Este projeto é licenciado sob a **MIT License** — sinta-se livre para usar, modificar e contribuir.  
Consulte o arquivo [`LICENSE`](LICENSE) para mais detalhes.

---

> 🎒 *“Perdeu? Achou com o IFLOW!”* 💙
