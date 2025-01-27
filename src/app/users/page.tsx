'use client'

import React, { useEffect, useState } from 'react';
import { Template, AuthenticatedPage } from '@/components';
import { useUserService } from '@/resources/userService/user.service'; // Ajuste o caminho conforme necessário
import { User } from '@/resources/user/users.resources'; // Ajuste o caminho conforme necessário

const UsersPage: React.FC = () => {
  const userService = useUserService(); // Acessa o serviço de usuários
  const [users, setUsers] = useState<User[]>([]); // Estado para armazenar os usuários
  const [loading, setLoading] = useState<boolean>(false); // Estado de carregamento
  const [searchMatricula, setSearchMatricula] = useState<string>(''); // Estado para a matrícula de busca
  const [errorMessage, setErrorMessage] = useState<string>(''); // Estado para a mensagem de erro

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersList = await userService.buscar();
        setUsers(usersList);
      } catch (error) {
        console.error("Erro ao buscar usuários", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchMatricula.trim() === '') {
        const usersList = await userService.buscar();
        setUsers(usersList);
        setErrorMessage('');
      } else {
        const usersList = await userService.buscarPorMatricula(searchMatricula);
        if (usersList.length === 0) {
          setErrorMessage('Usuário não cadastrado');
        } else {
          setErrorMessage('');
          setUsers(usersList);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar usuário por matrícula", error);
      setErrorMessage('Erro ao buscar usuário');
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthenticatedPage>
      <Template loading={loading}>
        <div className="container mx-auto p-4">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  value={searchMatricula}
                  onChange={(e) => setSearchMatricula(e.target.value)}
                  placeholder="Digite a matrícula"
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
                      <th className="border p-2">Matrícula</th>
                      <th className="border p-2">Username</th>
                      <th className="border p-2">Gestor</th>
                      <th className="border p-2">Dados Biométricos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="border p-2">{user.id}</td>
                        <td className="border p-2">{user.name}</td>
                        <td className="border p-2">{user.registration}</td>
                        <td className="border p-2">{user.username}</td>
                        <td className="border p-2">{user.manager ? "Sim" : "Não"}</td>
                        <td className="border p-2">{user.biometricData}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </Template>
    </AuthenticatedPage>
  );
};

export default UsersPage;
