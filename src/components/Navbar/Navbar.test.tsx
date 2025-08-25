// src/components/Navbar/Navbar.test.tsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('renderiza o logo corretamente', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logo = screen.getByText('Minha Escola');
    expect(logo).toBeInTheDocument();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('renderiza todos os links do menu', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const links = [
      { text: 'Início', href: '/' },
      { text: 'Alunos', href: '/students' },
      { text: 'Professores', href: '/teachers' },
      { text: 'Disciplinas', href: '/subjects' },
      { text: 'Salas', href: '/classrooms' },
      { text: 'Matrículas', href: '/enrollments' },
    ];

    links.forEach(({ text, href }) => {
      const linkElement = screen.getByText(text);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute('href', href);
    });
  });
});
