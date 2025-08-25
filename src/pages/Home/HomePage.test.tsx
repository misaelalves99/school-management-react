// src/pages/Home/HomePage.test.tsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('renderiza o título e a descrição principal', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Bem-vindo ao Sistema de Gestão Escolar/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Gerencie facilmente alunos, professores, disciplinas, matrículas, presenças e notas/i
      )
    ).toBeInTheDocument();
  });

  it('renderiza todos os links de gerenciamento corretamente', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    const links = [
      { text: /Gerenciar Alunos/i, href: '/students' },
      { text: /Gerenciar Professores/i, href: '/teachers' },
      { text: /Gerenciar Disciplinas/i, href: '/subjects' },
      { text: /Gerenciar Salas/i, href: '/classrooms' },
      { text: /Gerenciar Matrículas/i, href: '/enrollments' },
    ];

    links.forEach(({ text, href }) => {
      const link = screen.getByRole('link', { name: text });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', href);
    });
  });
});
