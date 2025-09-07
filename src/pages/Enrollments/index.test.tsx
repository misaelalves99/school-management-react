// src/pages/Enrollments/index.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EnrollmentIndexPage from './index';
import { MemoryRouter } from 'react-router-dom';
import { useEnrollments } from '../../hooks/useEnrollments';
import type { EnrollmentsContextType } from '../../contexts/Enrollments/EnrollmentsContext';

// Mocks de dados
const mockEnrollments = [
  { id: 1, studentId: 1, classRoomId: 1, enrollmentDate: '2025-01-01', status: 'Ativa' },
  { id: 2, studentId: 2, classRoomId: 2, enrollmentDate: '2025-01-02', status: 'Inativa' },
];
const mockStudents = [
  { id: 1, name: 'João' },
  { id: 2, name: 'Maria' },
];
const mockClassRooms = [
  { id: 1, name: 'Sala A' },
  { id: 2, name: 'Sala B' },
];

// Mock dos hooks
jest.mock('../../hooks/useEnrollments');
jest.mock('../../hooks/useStudents', () => ({
  useStudents: () => ({ students: mockStudents }),
}));
jest.mock('../../hooks/useClassRooms', () => ({
  useClassRooms: () => ({ classRooms: mockClassRooms }),
}));

describe('EnrollmentIndexPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useEnrollments).mockReturnValue({
      enrollments: mockEnrollments,
      refresh: jest.fn(),
      createEnrollment: jest.fn(),
      updateEnrollment: jest.fn(),
      removeEnrollment: jest.fn(),
    } as unknown as EnrollmentsContextType);
  });

  it('renderiza a lista de matrículas com nomes de alunos e turmas', () => {
    render(
      <MemoryRouter>
        <EnrollmentIndexPage />
      </MemoryRouter>
    );

    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('Sala A')).toBeInTheDocument();
    expect(screen.getByText('Sala B')).toBeInTheDocument();

    expect(screen.getAllByText('Detalhes')[0]).toHaveAttribute('href', '/enrollments/details/1');
    expect(screen.getAllByText('Editar')[0]).toHaveAttribute('href', '/enrollments/edit/1');
    expect(screen.getAllByText('Excluir')[0]).toHaveAttribute('href', '/enrollments/delete/1');
  });

  it('filtra matrículas pelo status', () => {
    render(
      <MemoryRouter>
        <EnrollmentIndexPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Buscar Matrícula ou Status/i);
    fireEvent.change(input, { target: { value: 'Inativa' } });

    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.queryByText('João')).not.toBeInTheDocument();
  });

  it('mostra mensagem quando não há matrículas', () => {
    jest.mocked(useEnrollments).mockReturnValue({
      enrollments: [],
      refresh: jest.fn(),
      createEnrollment: jest.fn(),
      updateEnrollment: jest.fn(),
      removeEnrollment: jest.fn(),
    } as unknown as EnrollmentsContextType);

    render(
      <MemoryRouter>
        <EnrollmentIndexPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Nenhuma matrícula encontrada.')).toBeInTheDocument();
  });

  it('atualiza a busca corretamente', () => {
    render(
      <MemoryRouter>
        <EnrollmentIndexPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Buscar Matrícula ou Status/i);
    fireEvent.change(input, { target: { value: 'Ativa' } });

    expect(screen.getByText('João')).toBeInTheDocument();
    expect(screen.queryByText('Maria')).not.toBeInTheDocument();
  });
});
