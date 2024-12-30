'use client';

import React from 'react';
import Link from 'next/link';
import { Template, AuthenticatedPage } from '@/components';
import './DashboardPage.css'; // Importa o arquivo de estilos

const DashboardPage: React.FC = () => {
    const pages = [
        { name: 'Buscar Usuários', path: '/users' },
        { name: 'Cadastrar Novo Usuário', path: '/cadastroUsuario' },
        { name: 'Galeria de Ferramentas', path: '/galeria' },
        { name: 'Buscar Ferramentas', path: '/tools' },
        { name: 'Atualizar Usuário', path: '/atualizarUsuario' },
        // Adicione novos links aqui no formato { name: 'Nome da Página', path: '/rota' }
      ];

  return (
    <AuthenticatedPage>
      <Template>
        <div className="dashboard-container">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="dashboard-links">
            {pages.map((page, index) => (
              <Link key={index} href={page.path}>
                <a className="dashboard-card">
                  <div className="card-content">
                    <h2>{page.name}</h2>
                    <p>Acesse a página de {page.name.toLowerCase()}.</p>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </Template>
    </AuthenticatedPage>
  );
};

export default DashboardPage;
