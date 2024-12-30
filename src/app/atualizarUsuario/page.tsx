'use client';

import React, { useState } from 'react';
import { Template, AuthenticatedPage } from '@/components';
import { useUserService } from '@/resources/userService/user.service'; // Importando o serviço de usuários
import { User } from '@/resources/user/users.resources'; // Importando o tipo User

const BuscarUsuarioPorMatricula: React.FC = () => {
  const userService = useUserService(); // Acessando o serviço de usuários
  const [matricula, setMatricula] = useState<string>(''); // Estado para armazenar a matrícula
  const [usuario, setUsuario] = useState<User | null>(null); // Estado para armazenar o usuário encontrado
  const [mensagemErro, setMensagemErro] = useState<string>(''); // Estado para mensagens de erro
  const [loading, setLoading] = useState<boolean>(false); // Estado para mostrar carregamento
  const [nome, setNome] = useState<string>(''); // Estado para o nome
  const [username, setUsername] = useState<string>(''); // Estado para o username
  const [biometricData, setBiometricData] = useState<string>(''); // Estado para dados biométricos

  const handleBuscar = async () => {
    if (!matricula.trim()) {
      setMensagemErro('Por favor, insira uma matrícula válida.');
      return;
    }

    setLoading(true);
    setMensagemErro('');
    try {
      // Chamando o método buscarPorMatricula do serviço
      const usuariosEncontrados = await userService.buscarPorMatricula(matricula);

      if (usuariosEncontrados.length === 0) {
        setMensagemErro('Usuário não encontrado para essa matrícula.');
        setUsuario(null); // Limpa o estado do usuário caso não encontre
      } else {
        const usuarioEncontrado = usuariosEncontrados[0]; // Assume que o primeiro usuário é o correto
        setUsuario(usuarioEncontrado);
        // Preenche os campos para edição com os dados do usuário encontrado
        setNome(usuarioEncontrado.name || ''); // Garantir que não seja undefined
        setUsername(usuarioEncontrado.username || ''); // Garantir que não seja undefined
        setBiometricData(usuarioEncontrado.biometricData || ''); // Garantir que não seja undefined
      }
    } catch (error) {
      setMensagemErro('Erro ao buscar usuário. Tente novamente.');
      console.error("Erro ao buscar usuário por matrícula", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAtualizar = async () => {
    if (!usuario) {
      setMensagemErro('Nenhum usuário encontrado para atualização.');
      return;
    }

    const updatedUser = { ...usuario, name: nome, username, biometricData };

    try {
      await userService.atualizar(updatedUser);
      setMensagemErro('');
      alert('Usuário atualizado com sucesso!');
    } catch (error) {
      setMensagemErro('Erro ao atualizar usuário. Tente novamente.');
      console.error("Erro ao atualizar o usuário", error);
    }
  };

  return (
    <AuthenticatedPage>
      <Template loading={loading}>
        <div className="container mx-auto p-4">
          <h2 className="text-center text-2xl font-bold mb-4">Buscar Usuário por Matrícula</h2>
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              placeholder="Digite a matrícula"
              className="border p-2 w-64 mb-2"
            />
            {mensagemErro && <p className="text-red-500 mb-2">{mensagemErro}</p>}
            <button
              onClick={handleBuscar}
              className="bg-blue-500 text-white p-2 w-32 hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>

          {usuario && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Usuário Encontrado:</h3>
              <div>
                <p><strong>Nome:</strong> <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="border p-2 mb-2" /></p>
                <p><strong>Matrícula:</strong> {usuario.registration}</p>
                <p><strong>Username:</strong> <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 mb-2" /></p>
                <p><strong>Dados Biométricos:</strong> <input type="text" value={biometricData} onChange={(e) => setBiometricData(e.target.value)} className="border p-2 mb-2" /></p>
              </div>
              <button
                onClick={handleAtualizar}
                className="bg-green-500 text-white p-2 w-32 hover:bg-green-700"
              >
                Atualizar
              </button>
            </div>
          )}
        </div>
      </Template>
    </AuthenticatedPage>
  );
};

export default BuscarUsuarioPorMatricula;
