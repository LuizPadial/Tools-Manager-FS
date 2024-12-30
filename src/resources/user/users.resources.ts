export class User {
    id?: number;              // Novo campo ID
    name?: string;            // Nome do usuário
    registration?: string;    // Matrícula do usuário
    username?: string;        // Nome de usuário
    password?: string;        // Senha do usuário
    manager?: boolean;      // Campo para indicar se o usuário é gestor
    biometricData?: string;   // Dados biométricos do usuário
}

export class Credentials {
    username?: string;        // Nome de usuário
    password?: string;        // Senha do usuário
}

export class AccessToken {
    accessToken?: string;     // Token de autenticação
}

export class UserSessionToken {
    name?: string;            // Nome do usuário
    username?: string;        // Nome de usuário
    accessToken?: string;     // Token de autenticação
    expiration?: number;      // Data de expiração do token
    id?: number;              // Novo campo ID
    registration?: string;    // Matrícula do usuário
    manager?: boolean;      // Campo para indicar se o usuário é gestor
    biometricData?: string;   // Dados biométricos do usuário
}
