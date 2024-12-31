import { Tool } from '../ferramenta/ferramenta'; // Ajuste o caminho conforme necessário
import { useAuth } from '@/resources'; // Ajuste o caminho conforme necessário

class ToolService {
    baseURL: string = process.env.NEXT_PUBLIC_API_URL + '/ferramentas'; // Endpoint da API de ferramentas
    auth = useAuth(); // Serviço de autenticação para pegar o token

    // Método para buscar as ferramentas
    async listar(): Promise<Tool[]> {
        const userSession = this.auth.getUserSession(); // Obtém a sessão do usuário autenticado
        const url = `${this.baseURL}`; // URL da API de ferramentas

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${userSession?.accessToken}`, // Cabeçalho com o token Bearer
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar ferramentas: ${response.statusText}`);
        }

        return await response.json(); // Retorna a lista de ferramentas
    }


    //função para buscar ferramenta por nome ou parte do nome
    async buscarPorNome(query: string): Promise<Tool[]> {
        const userSession = this.auth.getUserSession(); // Obtém a sessão do usuário autenticado
        const url = `${this.baseURL}/nome?query=${encodeURIComponent(query)}`; // URL para buscar ferramentas por nome

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${userSession?.accessToken}`, // Cabeçalho com o token Bearer
            },
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar ferramentas por nome: ${response.statusText}`);
        }

        return await response.json(); // Retorna a lista de ferramentas encontradas
    }

    //função para cadastrar ferramentas
    async cadastrar(ferramenta: Tool): Promise<Tool> {
        const userSession = this.auth.getUserSession(); // Obtém a sessão do usuário autenticado
        const url = `${this.baseURL}`; // URL base para cadastro de ferramentas
    
        const response = await fetch(url, {
            method: 'POST', // Método HTTP para criação de recurso
            headers: {
                "Authorization": `Bearer ${userSession?.accessToken}`, // Cabeçalho com o token Bearer
                "Content-Type": "application/json", // Cabeçalho indicando JSON no corpo
            },
            body: JSON.stringify(ferramenta), // Serializa a ferramenta para JSON
        });
    
        if (!response.ok) {
            throw new Error(`Erro ao cadastrar ferramenta: ${response.statusText}`);
        }
    
        return await response.json(); // Retorna a ferramenta cadastrada
    }

    async atualizar(id: number, ferramenta: Tool): Promise<Tool> {
        const userSession = this.auth.getUserSession(); // Obtém a sessão do usuário autenticado
        const url = `${this.baseURL}/${id}`; // URL para atualizar uma ferramenta específica
    
        const response = await fetch(url, {
            method: 'PUT', // Método HTTP para atualização de recurso
            headers: {
                "Authorization": `Bearer ${userSession?.accessToken}`, // Cabeçalho com o token Bearer
                "Content-Type": "application/json", // Cabeçalho indicando JSON no corpo
            },
            body: JSON.stringify(ferramenta), // Serializa a ferramenta para JSON
        });
    
        if (!response.ok) {
            throw new Error(`Erro ao atualizar ferramenta: ${response.statusText}`);
        }
    
        return await response.json(); // Retorna a ferramenta atualizada
    }
    
    
}

export const useToolService = () => new ToolService(); // Hook para acessar o serviço
