// "use client";

// import React, { useEffect, useState } from 'react';
// import { useToolService } from '@/resources/ferramentaService/ferramenta.service';
// import { Tool } from '@/resources/ferramenta/ferramenta';
// import { Template } from '@/components/Template';
// import { AuthenticatedPage } from '@/components/AuthenticatedPage';

// const FerramentasListar: React.FC = () => {
//   const toolService = useToolService(); // Serviço de ferramentas
//   const [ferramentas, setFerramentas] = useState<Tool[]>([]); // Estado para ferramentas
//   const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento
//   const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para busca por nome
//   const [errorMessage, setErrorMessage] = useState<string>(''); // Estado para mensagens de erro

//   // Fetch inicial das ferramentas
//   useEffect(() => {
//     const fetchFerramentas = async () => {
//       setLoading(true);
//       try {
//         const ferramentasList = await toolService.listar();
//         setFerramentas(ferramentasList);
//       } catch (error) {
//         console.error("Erro ao buscar ferramentas", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFerramentas();
//   }, []); // Nenhuma dependência para evitar loop infinito

//   // Função para buscar ferramentas por nome
//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       if (searchQuery.trim() === '') {
//         const ferramentasList = await toolService.listar();
//         setFerramentas(ferramentasList);
//         setErrorMessage('');
//       } else {
//         const ferramentasList = await toolService.buscarPorNome(searchQuery);
//         if (ferramentasList.length === 0) {
//           setErrorMessage('Nenhuma ferramenta encontrada com esse nome.');
//         } else {
//           setErrorMessage('');
//           setFerramentas(ferramentasList);
//         }
//       }
//     } catch (error) {
//       console.error("Erro ao buscar ferramentas por nome", error);
//       setErrorMessage('Erro ao buscar ferramentas.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthenticatedPage>
//       <Template>
//         <div className="container mx-auto p-4">
//           {loading ? (
//             <p>Carregando ferramentas...</p>
//           ) : (
//             <>
//               <div className="mb-4">
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="Digite o nome ou parte do nome da ferramenta"
//                   className="border p-2"
//                 />
//                 <button onClick={handleSearch} className="ml-2 p-2 bg-blue-500 text-white">
//                   Buscar
//                 </button>
//               </div>
//               {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//               <div className="overflow-x-auto">
//                 <table className="table-auto w-full border-collapse">
//                   <thead>
//                     <tr>
//                       <th className="border p-2">ID</th>
//                       <th className="border p-2">Nome</th>
//                       <th className="border p-2">Descrição</th>
//                       <th className="border p-2">Disponível</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {ferramentas.map((ferramenta) => (
//                       <tr key={ferramenta.id}>
//                         <td className="border p-2">{ferramenta.id}</td>
//                         <td className="border p-2">{ferramenta.name}</td>
//                         <td className="border p-2">{ferramenta.description}</td>
//                         <td className="border p-2">{ferramenta.available ? 'Sim' : 'Não'}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       </Template>
//     </AuthenticatedPage>
//   );
// };

// export default FerramentasListar;


"use client";

import React, { useEffect, useState } from "react";
import { useToolService } from "@/resources/ferramentaService/ferramenta.service";
import { Tool } from "@/resources/ferramenta/ferramenta";
import { Template } from "@/components/Template";
import { AuthenticatedPage } from "@/components/AuthenticatedPage";

const FerramentasListar: React.FC = () => {
  const toolService = useToolService();
  const [ferramentas, setFerramentas] = useState<Tool[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  useEffect(() => {
    const fetchFerramentas = async () => {
      setLoading(true);
      try {
        const ferramentasList = await toolService.listar();
        setFerramentas(ferramentasList);
      } catch (error) {
        console.error("Erro ao buscar ferramentas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFerramentas();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchQuery.trim() === "") {
        const ferramentasList = await toolService.listar();
        setFerramentas(ferramentasList);
        setErrorMessage("");
      } else {
        const ferramentasList = await toolService.buscarPorNome(searchQuery);
        if (ferramentasList.length === 0) {
          setErrorMessage("Nenhuma ferramenta encontrada com esse nome.");
        } else {
          setErrorMessage("");
          setFerramentas(ferramentasList);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar ferramentas por nome", error);
      setErrorMessage("Erro ao buscar ferramentas.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (tool: Tool) => {
    setSelectedTool(tool);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTool(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedTool || selectedTool.id === undefined) {
      console.error("Ferramenta ou ID não está definido.");
      return;
    }
  
    setLoading(true);
    try {
      await toolService.atualizar(selectedTool.id, selectedTool);
      setFerramentas((prev) =>
        prev.map((tool) => (tool.id === selectedTool.id ? selectedTool : tool))
      );
      handleModalClose();
    } catch (error) {
      console.error("Erro ao atualizar ferramenta", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AuthenticatedPage>
      <Template>
        <div className="container mx-auto p-4">
          {loading ? (
            <p>Carregando ferramentas...</p>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite o nome ou parte do nome da ferramenta"
                  className="border p-2"
                />
                <button onClick={handleSearch} className="ml-2 p-2 bg-blue-500 text-white">
                  Buscar
                </button>
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2">ID</th>
                      <th className="border p-2">Nome</th>
                      <th className="border p-2">Descrição</th>
                      <th className="border p-2">Disponível</th>
                      <th className="border p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ferramentas.map((ferramenta) => (
                      <tr key={ferramenta.id}>
                        <td className="border p-2">{ferramenta.id}</td>
                        <td className="border p-2">{ferramenta.name}</td>
                        <td className="border p-2">{ferramenta.description}</td>
                        <td className="border p-2">{ferramenta.available ? "Sim" : "Não"}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => handleEditClick(ferramenta)}
                            className="p-2 bg-yellow-500 text-white"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {isModalOpen && selectedTool && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded">
                <h2 className="text-lg font-bold mb-4">Editar Ferramenta</h2>
                <label className="block mb-2">Nome:</label>
                <input
                  type="text"
                  value={selectedTool.name}
                  onChange={(e) =>
                    setSelectedTool({ ...selectedTool, name: e.target.value })
                  }
                  className="border p-2 mb-4 w-full"
                />
                <label className="block mb-2">Descrição:</label>
                <textarea
                  value={selectedTool.description}
                  onChange={(e) =>
                    setSelectedTool({ ...selectedTool, description: e.target.value })
                  }
                  className="border p-2 mb-4 w-full"
                />
                {/* <label className="block mb-2">Disponível:</label>
                <input
                  type="checkbox"
                  checked={selectedTool.available}
                  onChange={(e) =>
                    setSelectedTool({ ...selectedTool, available: e.target.checked })
                  }
                  className="mb-4"
                /> */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveChanges}
                    className="p-2 bg-green-500 text-white mr-2"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={handleModalClose}
                    className="p-2 bg-red-500 text-white"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Template>
    </AuthenticatedPage>
  );
};

export default FerramentasListar;
