// src/pages/Enrollments/index.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EnrollmentIndexPage from './index';
import { MemoryRouter } from 'react-router-dom';

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

const removeEnrollmentMock = jest.fn();

jest.mock('../../hooks/useEnrollments', () => ({
  useEnrollments: () => ({
    enrollments: mockEnrollments,
    removeEnrollment: removeEnrollmentMock,
  }),
}));

jest.mock('../../hooks/useStudents', () => ({
  useStudents: () => ({ students: mockStudents }),
}));

jest.mock('../../hooks/useClassRooms', () => ({
  useClassRooms: () => ({ classRooms: mockClassRooms }),
}));

describe('EnrollmentIndexPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
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

  it('chama removeEnrollment ao clicar em Excluir', () => {
    render(
      <MemoryRouter>
        <EnrollmentIndexPage />
      </MemoryRouter>
    );

    const deleteButtons = screen.getAllByText('Excluir');
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Deseja realmente excluir esta matrícula?');
    expect(removeEnrollmentMock).toHaveBeenCalledWith(1);
  });

  it('não chama removeEnrollment se confirmar for cancelado', () => {
    (window.confirm as jest.Mock).mockReturnValueOnce(false);

    render(
      <MemoryRouter>
        <EnrollmentIndexPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByText('Excluir')[0]);
    expect(removeEnrollmentMock).not.toHaveBeenCalled();
  });

  it('mostra mensagem quando não há matrículas', () => {
    jest.mocked(removeEnrollmentMock).mockReturnValue([]);
    jest.mock('../../hooks/useEnrollments', () => ({
      useEnrollments: () => ({ enrollments: [], removeEnrollment: removeEnrollmentMock }),
    }));

    render(
      <MemoryRouter>
        <EnrollmentIndexPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Nenhuma matrícula encontrada.')).toBeInTheDocument();
  });
});
