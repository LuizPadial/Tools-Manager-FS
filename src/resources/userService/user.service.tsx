import { User } from '../user/users.resources' ; 
import { useAuth } from '@/resources'; // Ajuste o caminho conforme necessário

class UserService {
    baseURL: string = process.env.NEXT_PUBLIC_API_URL + '/users'; // Defina o endpoint da sua API de usuários
    auth = useAuth(); // Usando o serviço de autenticação para pegar o token

    // Método para buscar os usuários
    async buscar(): Promise<User[]> {
        const userSession = this.auth.getUserSession(); // Pega o token do usuário autenticado
        const url = `${this.baseURL}`; // URL para a requisição de usuários
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${userSession?.accessToken}`, // Passando o token no cabeçalho
            }
        });
        return await response.json(); // Retorna a lista de usuários
    }
    
    // Método para salvar um novo usuário (caso necessário)
    async salvar(user: User): Promise<string> {
        const userSession = this.auth.getUserSession();
        const response = await fetch(this.baseURL, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userSession?.accessToken}`,
            }
        });

        return response.headers.get('location') ?? ''; // Retorna a URL do novo usuário, caso a criação tenha sucesso
    }

    async buscarPorMatricula(matricula: string): Promise<User[]> {
        const userSession = this.auth.getUserSession();
        const url = `${this.baseURL}/registration/${matricula}`; // Caminho da URL com matrícula
    
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${userSession?.accessToken}`,
            }
        });
    
        if (!response.ok) {
            throw new Error("Erro ao buscar usuário por matrícula");
        }
    
        return await response.json();
    }
    
}

export const useUserService = () => new UserService(); // Hook para acessar o serviço
