# 🌀 IFLOW – Fluxo Inteligente de Achados e Perdidos

> *Uma plataforma moderna, segura e sustentável para gerenciar achados e perdidos em ambientes escolares.*

---

## 📖 Sobre o Projeto

O *IFLOW* é um sistema web de *achados e perdidos escolar, criado para **modernizar e otimizar o gerenciamento de objetos perdidos e encontrados* dentro das instituições de ensino.
Ele substitui o processo manual e desorganizado por uma *plataforma digital centralizada, facilitando o registro, a consulta e a devolução de itens de forma **rápida, transparente e sustentável*.

💡 Desenvolvido como *Trabalho de Conclusão de Curso (TCC)* pelos alunos *Jackson Luis Fagundes Schirigatti, **Leandro Raphael de Souza Klaen* e *João Vitor Vicente Franco de Souza, do curso **Técnico Integrado em Informática* do *Instituto Federal do Paraná – Campus Curitiba*.
Orientação de *Prof. Fábio Luiz Pessoa Albini* e *Profa. Rose (sobrenome não especificado)*.

---

## 🎯 Objetivos

O *objetivo principal* é *digitalizar o fluxo de achados e perdidos*, automatizando todo o processo de registro, consulta e devolução de objetos.

### 🎯 Objetivos específicos:

* Facilitar o cadastro de itens encontrados com fotos e descrições;
* Permitir que alunos e servidores localizem objetos facilmente;
* Reduzir o tempo de espera e o acúmulo de itens;
* Oferecer ferramentas administrativas de controle e relatórios;
* Garantir transparência e segurança no gerenciamento dos registros.

---

## 🌍 Alinhamento com os Objetivos da ONU (ODS)

O projeto *iFlow* está alinhado com os *Objetivos de Desenvolvimento Sustentável (ODS)* da ONU:

| ODS           | Título                               | Como o IFLOW contribui                                                                   |
| ------------- | ------------------------------------ | ---------------------------------------------------------------------------------------- |
| 🟦 *ODS 4*  | Educação de Qualidade                | Melhora a gestão escolar e promove responsabilidade entre alunos e servidores.           |
| 🟩 *ODS 9*  | Indústria, Inovação e Infraestrutura | Introduz inovação tecnológica em processos educacionais, digitalizando rotinas internas. |
| 🟨 *ODS 12* | Consumo e Produção Responsáveis      | Incentiva a devolução e reaproveitamento de objetos, reduzindo desperdício de materiais. |

---

## 🚀 Principais Funcionalidades

* 📸 *Cadastro completo de itens* com foto, descrição, categoria e local de achado;
* 🔎 *Busca com filtros avançados* (por nome, categoria, local e status);
* 🧑‍💻 *Autenticação segura* via [Supabase Auth](https://supabase.com/);
* 🧭 *Painel administrativo* para gerenciamento e validação de itens;
* 📊 *Dashboard de relatórios* com gráficos e estatísticas;
* 🌱 *Sustentabilidade* — itens não reclamados podem ser destinados à doação.

---

## 🧰 Tecnologias Utilizadas

### 🖥️ Frontend

* [React.js](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Vite](https://vitejs.dev/)
* [Lucide Icons](https://lucide.dev/)
* [Framer Motion](https://www.framer.com/motion/)

### ⚙️ Backend

* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/)
* [Prisma ORM](https://www.prisma.io/)
* [PostgreSQL](https://www.postgresql.org/)
* [Supabase](https://supabase.com/)

---

## 🧪 Metodologia

O desenvolvimento do IFLOW seguiu uma *metodologia ágil e incremental*, com foco em:

* Testes contínuos e iteração com feedback real de usuários;
* Design centrado na usabilidade, acessibilidade e eficiência;
* Implementação de recursos de autenticação, segurança e responsividade;
* Uso de tecnologias modernas e escaláveis no ecossistema JavaScript.

---

## 🖼️ Demonstração

### 💻 Interface do Usuário

![Tela inicial](./assets/demo/home.gif)

### ⚙️ Painel Administrativo

![Painel admin](./assets/demo/admin.gif)

### 📊 Dashboard e Relatórios

![Dashboard](./assets/demo/dashboard.gif)

### 📱 Layout Responsivo

![Responsivo](./assets/demo/mobile.gif)

> 💡 Para adicionar GIFs no README, basta colocá-los dentro de uma pasta (ex: ./assets/demo/) e usar a sintaxe:
>
> md
> ![Descrição do GIF](./assets/demo/nome-do-gif.gif)
> 

---

## 🧩 Estrutura do Projeto

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


---

## 🧑‍💼 Autores

| Nome                                   | Função                         | Contato                                                                     |
| -------------------------------------- | ------------------------------ | --------------------------------------------------------------------------- |

| *Jackson Luis Fagundes Schirigatti*   
| *Leandro Raphael de Souza Klaen*  
| *João Vitor Vicente Franco de Souza* 

*Orientadores:*
👨‍🏫 Prof. Fábio Luiz Pessoa Albini
👩‍🏫 Profa. Rose 

*Instituição:*
📍 Instituto Federal do Paraná – Campus Curitiba
🎓 Curso Técnico Integrado em Informática

---

## 🏁 Como Executar o Projeto

### 🔧 Pré-requisitos

* Node.js ≥ 18
* PostgreSQL
* Conta no Supabase (para Auth e DB, se desejar)

### ▶️ Passos

bash
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


Acesse o projeto em *[http://localhost:5173](http://localhost:5173)*

---

## 💬 Impacto e Legado

O *IFLOW* representa uma *solução tecnológica inovadora* e *de impacto social*, promovendo:

* A *organização e eficiência* no ambiente escolar;
* A *educação digital* e o uso consciente da tecnologia;
* A *sustentabilidade* por meio do reaproveitamento de objetos;
* A *formação cidadã* dos alunos ao incentivar honestidade e colaboração.

> Cada item devolvido é uma pequena vitória pela confiança e empatia dentro da escola.

---

## 🪪 Licença

Este projeto é licenciado sob a *MIT License* — sinta-se livre para usar, modificar e contribuir.
Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

> 🎒 “Perdeu? Achou com o IFLOW!” 💙
