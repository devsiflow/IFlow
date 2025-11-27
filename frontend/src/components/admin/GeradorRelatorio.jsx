// import { useEffect, useState, useMemo } from "react";
// import * as XLSX from "xlsx";
// import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

// export default function GeradorRelatorio({ solicitacoes = [] }) {
//   // 🔥 CORREÇÃO: Usar o mês atual como padrão
//   const [periodo, setPeriodo] = useState(() => {
//     const now = new Date();
//     return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
//   });
  
//   const [tipoRelatorio, setTipoRelatorio] = useState("validacoes");

//   // 🔥 DEBUG: Mostrar informações sobre as solicitações
//   useEffect(() => {
//     console.log("📊 DEBUG GeradorRelatorio:");
//     console.log("Total de solicitações:", solicitacoes.length);
//     if (solicitacoes.length > 0) {
//       console.log("Primeira solicitação:", {
//         id: solicitacoes[0].id,
//         status: solicitacoes[0].status,
//         data_solicitacao: solicitacoes[0].data_solicitacao,
//         createdAt: solicitacoes[0].createdAt,
//         data: solicitacoes[0].data,
//         item: solicitacoes[0].item ? "presente" : "ausente"
//       });
//     }
//   }, [solicitacoes]);

//   // 🔥 CORREÇÃO: Processar dados locais com melhor tratamento de datas
//   const dadosFiltrados = useMemo(() => {
//     if (!solicitacoes.length) {
//       console.log("❌ Nenhuma solicitação disponível");
//       return [];
//     }

//     console.log(`🔍 Filtrando para período: ${periodo}`);
    
//     const [ano, mes] = periodo.split('-').map(Number);
//     const dataInicio = new Date(ano, mes - 1, 1);
//     const dataFim = new Date(ano, mes, 0, 23, 59, 59); // Fim do mês

//     console.log(`📅 Período: ${dataInicio.toLocaleDateString()} até ${dataFim.toLocaleDateString()}`);

//     const filtradas = solicitacoes.filter(solicitacao => {
//       // Tentar diferentes campos de data
//       const dataSolicitacao = new Date(
//         solicitacao.data_solicitacao || 
//         solicitacao.createdAt || 
//         solicitacao.data ||
//         new Date() // Fallback para data atual
//       );

//       // Debug individual
//       if (solicitacao.id === solicitacoes[0]?.id) {
//         console.log("📅 Data da primeira solicitação:", {
//           dataSolicitacao: dataSolicitacao.toLocaleDateString(),
//           dataInicio: dataInicio.toLocaleDateString(),
//           dataFim: dataFim.toLocaleDateString(),
//           dentroPeriodo: dataSolicitacao >= dataInicio && dataSolicitacao <= dataFim
//         });
//       }

//       return dataSolicitacao >= dataInicio && dataSolicitacao <= dataFim;
//     });

//     console.log(`✅ ${filtradas.length} solicitações filtradas`);
//     return filtradas;
//   }, [solicitacoes, periodo]);

//   // 🔥 Gerar dados para o gráfico
//   const grafico = useMemo(() => {
//     let dadosGrafico = [];
    
//     if (tipoRelatorio === "validacoes") {
//       const contagem = {
//         pendentes: dadosFiltrados.filter(d => d.status === "pendente").length,
//         aprovadas: dadosFiltrados.filter(d => d.status === "aprovada").length,
//         negadas: dadosFiltrados.filter(d => d.status === "negada").length,
//       };

//       dadosGrafico = [
//         { name: "Pendentes", value: contagem.pendentes },
//         { name: "Aprovadas", value: contagem.aprovadas },
//         { name: "Negadas", value: contagem.negadas },
//       ].filter(item => item.value > 0);
//     } else {
//       // Para itens, extrair dados dos itens vinculados
//       const itens = dadosFiltrados.map(s => s.item).filter(Boolean);
//       const contagem = {
//         perdidos: itens.filter(d => d?.status === "perdido").length,
//         encontrados: itens.filter(d => d?.status === "encontrado").length,
//         devolvidos: itens.filter(d => d?.status === "devolvido").length,
//       };

//       dadosGrafico = [
//         { name: "Perdidos", value: contagem.perdidos },
//         { name: "Encontrados", value: contagem.encontrados },
//         { name: "Devolvidos", value: contagem.devolvidos },
//       ].filter(item => item.value > 0);
//     }

//     console.log("📈 Dados do gráfico:", dadosGrafico);
//     return dadosGrafico;
//   }, [dadosFiltrados, tipoRelatorio]);

//   function traduzirStatus(status) {
//     const map = {
//       perdido: "Perdido",
//       encontrado: "Encontrado", 
//       devolvido: "Devolvido",
//       pendente: "Pendente",
//       aprovada: "Aprovada", 
//       negada: "Negada",
//     };
//     return map[status] || status;
//   }

//   function formatarData(dataStr) {
//     if (!dataStr) return "";
//     try {
//       const data = new Date(dataStr);
//       return isNaN(data.getTime()) ? "" : data.toLocaleDateString("pt-BR");
//     } catch {
//       return "";
//     }
//   }

//   function formatarDataCompleta(dataStr) {
//     if (!dataStr) return "";
//     try {
//       const data = new Date(dataStr);
//       return isNaN(data.getTime()) ? "" : data.toLocaleString("pt-BR");
//     } catch {
//       return "";
//     }
//   }

//   // 🔥 FUNÇÃO PRINCIPAL PARA EXPORTAR EXCEL
//   function exportarExcel() {
//     if (!dadosFiltrados.length) {
//       alert("Nenhum dado para exportar no período selecionado.");
//       return;
//     }

//     let planilhaDados = [];
//     let tituloRelatorio = "";

//     if (tipoRelatorio === "validacoes") {
//       tituloRelatorio = "SOLICITAÇÕES DE VALIDAÇÃO";
//       planilhaDados = dadosFiltrados.map((item, index) => ({
//         "Nº": index + 1,
//         "ID Solicitação": item.id,
//         "Item": item.item?.title || "Item não encontrado",
//         "Categoria": item.item?.category?.name || "—",
//         "Status Solicitação": traduzirStatus(item.status),
//         "Aluno": item.aluno?.name || item.profile?.name || "—",
//         "Matrícula": item.aluno?.matricula || item.profile?.matricula || "—",
//         "Campus": item.aluno?.campus?.nome || item.profile?.campus?.nome || "—",
//         "Data Solicitação": formatarData(item.data_solicitacao || item.createdAt),
//         "Status do Item": traduzirStatus(item.item?.status),
//         "Local do Item": item.item?.location || "—",
//         "Descrição do Item": item.item?.description || "—",
//       }));
//     } else {
//       tituloRelatorio = "ITENS VINCULADOS ÀS SOLICITAÇÕES";
//       // Extrair itens únicos das solicitações
//       const itensUnicos = [];
//       const idsProcessados = new Set();
      
//       dadosFiltrados.forEach(solicitacao => {
//         if (solicitacao.item && !idsProcessados.has(solicitacao.item.id)) {
//           idsProcessados.add(solicitacao.item.id);
//           itensUnicos.push({
//             ...solicitacao.item,
//             totalSolicitacoes: dadosFiltrados.filter(s => s.item?.id === solicitacao.item.id).length
//           });
//         }
//       });

//       planilhaDados = itensUnicos.map((item, index) => ({
//         "Nº": index + 1,
//         "ID Item": item.id,
//         "Título": item.title,
//         "Descrição": item.description,
//         "Status": traduzirStatus(item.status),
//         "Local": item.location,
//         "Categoria": item.category?.name || "—",
//         "Campus": item.campus?.nome || "—",
//         "Proprietário": item.user?.name || "—",
//         "Matrícula": item.user?.matricula || "—",
//         "Data Criação": formatarData(item.createdAt),
//         "Total Solicitações": item.totalSolicitacoes,
//       }));
//     }

//     // Dados resumidos
//     const totais = {
//       "Total de Registros": planilhaDados.length,
//       "Período do Relatório": periodo,
//       "Data de Geração": formatarDataCompleta(new Date()),
//     };

//     if (tipoRelatorio === "validacoes") {
//       totais["Pendentes"] = dadosFiltrados.filter(d => d.status === "pendente").length;
//       totais["Aprovadas"] = dadosFiltrados.filter(d => d.status === "aprovada").length;
//       totais["Negadas"] = dadosFiltrados.filter(d => d.status === "negada").length;
//     } else {
//       totais["Perdidos"] = planilhaDados.filter(d => d.Status === "Perdido").length;
//       totais["Encontrados"] = planilhaDados.filter(d => d.Status === "Encontrado").length;
//       totais["Devolvidos"] = planilhaDados.filter(d => d.Status === "Devolvido").length;
//     }

//     const resumo = Object.entries(totais).map(([key, value]) => ({
//       "Métrica": key,
//       "Valor": value
//     }));

//     // Cria worksheets
//     const wsDados = XLSX.utils.json_to_sheet(planilhaDados);
//     const wsResumo = XLSX.utils.json_to_sheet(resumo);

//     // Ajusta largura das colunas
//     const larguras = tipoRelatorio === "validacoes" 
//       ? [
//           { wch: 6 }, { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 18 },
//           { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 16 }, { wch: 15 },
//           { wch: 20 }, { wch: 30 }
//         ]
//       : [
//           { wch: 6 }, { wch: 10 }, { wch: 30 }, { wch: 40 }, { wch: 12 },
//           { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 12 },
//           { wch: 16 }, { wch: 18 }
//         ];

//     wsDados["!cols"] = larguras;
//     wsResumo["!cols"] = [{ wch: 25 }, { wch: 20 }];

//     // Cria workbook
//     const wb = XLSX.utils.book_new();
    
//     // Adiciona cabeçalho personalizado
//     XLSX.utils.sheet_add_aoa(wsDados, [
//       [`RELATÓRIO - ${tituloRelatorio}`],
//       [`Sistema iFlow - Achados e Perdidos`],
//       [`Período: ${periodo}`],
//       [`Data de geração: ${formatarDataCompleta(new Date())}`],
//       [], // linha vazia
//       Object.keys(planilhaDados[0]) // cabeçalhos
//     ], { origin: "A1" });

//     // Mescla células do título
//     if (!wsDados["!merges"]) wsDados["!merges"] = [];
//     const numCols = Object.keys(planilhaDados[0]).length;
//     for (let i = 0; i < 4; i++) {
//       wsDados["!merges"].push({ s: { r: i, c: 0 }, e: { r: i, c: numCols - 1 } });
//     }

//     // Adiciona worksheets
//     const nomeAba = tipoRelatorio === "validacoes" ? "Solicitações" : "Itens";
//     XLSX.utils.book_append_sheet(wb, wsDados, nomeAba);
//     XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");

//     // Gera arquivo
//     const nomeArquivo = `relatorio_iflow_${periodo.replace('-', '_')}.xlsx`;
//     XLSX.writeFile(wb, nomeArquivo);
    
//     console.log(`✅ Relatório exportado: ${nomeArquivo}`);
//     alert(`Relatório exportado com sucesso!\n${planilhaDados.length} registros encontrados.`);
//   }

//   return (
//     <div className="flex flex-col items-center gap-6 p-4">
//       {/* Controles */}
//       <div className="flex flex-col md:flex-row gap-4 items-center w-full max-w-2xl">
//         <div className="flex flex-col flex-1">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Período:
//           </label>
//           <input
//             type="month"
//             value={periodo}
//             onChange={(e) => setPeriodo(e.target.value)}
//             className="border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
//           />
//         </div>

//         <div className="flex flex-col flex-1">
//           <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//             Tipo de Relatório:
//           </label>
//           <select
//             value={tipoRelatorio}
//             onChange={(e) => setTipoRelatorio(e.target.value)}
//             className="border border-gray-300 dark:border-neutral-600 rounded px-3 py-2 bg-white dark:bg-neutral-800 text-gray-900 dark:text-white"
//           >
//             <option value="validacoes">Solicitações</option>
//             <option value="itens">Itens</option>
//           </select>
//         </div>

//         <button
//           onClick={exportarExcel}
//           disabled={!dadosFiltrados.length}
//           className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 mt-6"
//         >
//           📊 Exportar Excel
//         </button>
//       </div>

//       {/* Informações do Relatório */}
//       <div className="text-center">
//         <p className="text-gray-600 dark:text-gray-400">
//           Período selecionado: <strong>{periodo}</strong>
//         </p>
//         <p className="text-gray-600 dark:text-gray-400">
//           {dadosFiltrados.length} {tipoRelatorio === "validacoes" ? "solicitações" : "itens"} encontrados
//           {solicitacoes.length > 0 && ` (de ${solicitacoes.length} totais)`}
//         </p>
//       </div>

//       {/* Estatísticas */}
//       {dadosFiltrados.length > 0 && (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
//           <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
//             <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
//               {dadosFiltrados.length}
//             </div>
//             <div className="text-sm text-blue-700 dark:text-blue-300">Total</div>
//           </div>
          
//           {tipoRelatorio === "validacoes" ? (
//             <>
//               <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
//                   {dadosFiltrados.filter(d => d.status === "pendente").length}
//                 </div>
//                 <div className="text-sm text-yellow-700 dark:text-yellow-300">Pendentes</div>
//               </div>
//               <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                   {dadosFiltrados.filter(d => d.status === "aprovada").length}
//                 </div>
//                 <div className="text-sm text-green-700 dark:text-green-300">Aprovadas</div>
//               </div>
//               <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-red-600 dark:text-red-400">
//                   {dadosFiltrados.filter(d => d.status === "negada").length}
//                 </div>
//                 <div className="text-sm text-red-700 dark:text-red-300">Negadas</div>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-red-600 dark:text-red-400">
//                   {grafico.find(g => g.name === "Perdidos")?.value || 0}
//                 </div>
//                 <div className="text-sm text-red-700 dark:text-red-300">Perdidos</div>
//               </div>
//               <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-green-600 dark:text-green-400">
//                   {grafico.find(g => g.name === "Encontrados")?.value || 0}
//                 </div>
//                 <div className="text-sm text-green-700 dark:text-green-300">Encontrados</div>
//               </div>
//               <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
//                 <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
//                   {grafico.find(g => g.name === "Devolvidos")?.value || 0}
//                 </div>
//                 <div className="text-sm text-purple-700 dark:text-purple-300">Devolvidos</div>
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {/* Gráfico */}
//       {grafico.length > 0 && (
//         <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
//           <h3 className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-white">
//             Distribuição - {periodo}
//           </h3>
//           <PieChart width={350} height={300}>
//             <Pie
//               data={grafico}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={100}
//               label={({ name, value }) => `${name}: ${value}`}
//             >
//               {grafico.map((_, i) => (
//                 <Cell
//                   key={i}
//                   fill={["#fbbf24", "#34d399", "#f87171", "#60a5fa", "#a78bfa"][i % 5]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </div>
//       )}

//       {!dadosFiltrados.length && solicitacoes.length > 0 && (
//         <div className="text-yellow-600 dark:text-yellow-400 text-center">
//           ⚠️ Nenhum dado encontrado para o período <strong>{periodo}</strong>.
//           <br />
//           <span className="text-sm">
//             Total de solicitações disponíveis: {solicitacoes.length}
//             <br />
//             Tente selecionar um período diferente.
//           </span>
//         </div>
//       )}

//       {!solicitacoes.length && (
//         <div className="text-red-600 dark:text-red-400 text-center">
//           ❌ Nenhuma solicitação disponível para gerar relatório.
//           <br />
//           <span className="text-sm">Verifique se há solicitações cadastradas no sistema.</span>
//         </div>
//       )}

//       {/* 🔥 DEBUG: Mostrar informações técnicas */}
//       <details className="text-xs text-gray-500 mt-4">
//         <summary>Informações de Debug</summary>
//         <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
//           <p>Período selecionado: {periodo}</p>
//           <p>Total de solicitações: {solicitacoes.length}</p>
//           <p>Filtradas: {dadosFiltrados.length}</p>
//           {solicitacoes.length > 0 && (
//             <>
//               <p>Primeira solicitação ID: {solicitacoes[0].id}</p>
//               <p>Status: {solicitacoes[0].status}</p>
//               <p>Data: {solicitacoes[0].data_solicitacao || solicitacoes[0].createdAt || "Não informada"}</p>
//             </>
//           )}
//         </div>
//       </details>
//     </div>
//   );
// }