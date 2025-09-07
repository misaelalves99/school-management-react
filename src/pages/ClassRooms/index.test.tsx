// src/pages/ClassRooms/index.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClassroomsPage from './index';
import { useClassRooms } from '../../hooks/useClassRooms';
import type { ClassRoom } from '../../types/classroom.ts';

jest.mock('../../hooks/useClassRooms');

describe('ClassroomsPage', () => {
  const mockRooms: ClassRoom[] = [
    { id: 1, name: 'Sala A', capacity: 30, schedule: 'Seg - 08:00 às 10:00', subjects: [], teachers: [], classTeacher: undefined },
    { id: 2, name: 'Sala B', capacity: 25, schedule: 'Ter - 10:00 às 12:00', subjects: [], teachers: [], classTeacher: undefined },
    { id: 3, name: 'Sala C', capacity: 20, schedule: 'Qua - 13:00 às 15:00', subjects: [], teachers: [], classTeacher: undefined },
  ];

  beforeEach(() => {
    (useClassRooms as jest.Mock).mockReturnValue({ classRooms: mockRooms });
  });

  it('renderiza a lista de salas', () => {
    render(
      <BrowserRouter>
        <ClassroomsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Lista de Salas/i)).toBeInTheDocument();
    expect(screen.getByText(/Sala A/i)).toBeInTheDocument();
    expect(screen.getByText(/Sala B/i)).toBeInTheDocument();
    expect(screen.getByText(/Sala C/i)).toBeInTheDocument();
  });

  it('exibe mensagem quando não há salas', () => {
    (useClassRooms as jest.Mock).mockReturnValue({ classRooms: [] });

    render(
      <BrowserRouter>
        <ClassroomsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Nenhuma sala encontrada/i)).toBeInTheDocument();
  });

  it('filtra salas pelo nome, horário e capacidade', () => {
    render(
      <BrowserRouter>
        <ClassroomsPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Digite nome, horário ou capacidade/i);

    // Filtrar pelo nome
    fireEvent.change(input, { target: { value: 'Sala B' } });
    expect(screen.queryByText(/Sala A/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Sala B/i)).toBeInTheDocument();

    // Filtrar pelo horário
    fireEvent.change(input, { target: { value: 'Qua - 13:00' } });
    expect(screen.queryByText(/Sala A/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Sala B/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Sala C/i)).toBeInTheDocument();

    // Filtrar pela capacidade
    fireEvent.change(input, { target: { value: '30' } });
    expect(screen.getByText(/Sala A/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sala B/i)).not.toBeInTheDocument();
  });

  it('botões de links para detalhes, editar e excluir existem', () => {
    render(
      <BrowserRouter>
        <ClassroomsPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Detalhes/i)).toBeInTheDocument();
    expect(screen.getByText(/Editar/i)).toBeInTheDocument();
    expect(screen.getByText(/Excluir/i)).toBeInTheDocument();
  });

  it('navegação para página de criação existe', () => {
    render(
      <BrowserRouter>
        <ClassroomsPage />
      </BrowserRouter>
    );

    const createBtn = screen.getByText(/Cadastrar Nova Sala/i);
    expect(createBtn.closest('a')).toHaveAttribute('href', '/classrooms/create');
  });
});
