// src/pages/ErrorPage/ErrorPage.test.tsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ErrorPage from './ErrorPage';

describe('ErrorPage', () => {
  it('renderiza a página de erro sem detalhes quando state é undefined', () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Ops! Algo deu errado/i)).toBeInTheDocument();
    expect(screen.getByText(/Desculpe, ocorreu um erro inesperado/i)).toBeInTheDocument();
    expect(screen.queryByText(/Detalhes do Erro/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para o início/i })).toBeInTheDocument();
  });

  it('exibe detalhes do erro quando fornecido no state', () => {
    const errorData = {
      message: 'Erro de teste',
      stack: 'stack trace aqui'
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/error', state: { error: errorData } }]}>
        <ErrorPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Detalhes do Erro/i)).toBeInTheDocument();
    expect(screen.getByText(/Mensagem:/i)).toBeInTheDocument();
    expect(screen.getByText(/Erro de teste/i)).toBeInTheDocument();
    expect(screen.getByText(/stack trace aqui/i)).toBeInTheDocument();
  });

  it('tem link de retorno para a página inicial', () => {
    render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /voltar para o início/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
