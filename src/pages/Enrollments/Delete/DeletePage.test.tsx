// src/pages/Enrollments/Delete/DeletePage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteEnrollment from './DeletePage';
import { MemoryRouter } from 'react-router-dom';
import type { EnrollmentWithNames } from '../../../types/EnrollmentWithNames';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('DeleteEnrollment', () => {
  const enrollmentMock: EnrollmentWithNames = {
    id: 1,
    studentId: 1,
    classRoomId: 1,
    studentName: 'João Silva',
    classRoomName: 'Sala A',
    enrollmentDate: '2025-01-10',
    status: 'Ativa',
  };

  const onDeleteMock = jest.fn<Promise<void>, [number]>();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente os detalhes da matrícula', () => {
    render(
      <MemoryRouter>
        <DeleteEnrollment enrollment={enrollmentMock} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Excluir Matrícula/i)).toBeInTheDocument();
    expect(screen.getByText(/Aluno:/i)).toHaveTextContent('Aluno: João Silva');
    expect(screen.getByText(/Turma:/i)).toHaveTextContent('Turma: Sala A');
    expect(screen.getByText(/Data da Matrícula:/i)).toHaveTextContent('Data da Matrícula: 10/01/2025');
    expect(screen.getByText(/Status:/i)).toHaveTextContent('Status: Ativa');
    expect(screen.getByText(/Excluir/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  it('chama onDelete e navega ao enviar o formulário', async () => {
    onDeleteMock.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <DeleteEnrollment enrollment={enrollmentMock} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Excluir/i));

    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledWith(enrollmentMock.id);
      expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
    });
  });

  it('exibe alert ao falhar na exclusão', async () => {
    onDeleteMock.mockRejectedValueOnce(new Error('Falha'));
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <DeleteEnrollment enrollment={enrollmentMock} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Excluir/i));

    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledWith(enrollmentMock.id);
      expect(window.alert).toHaveBeenCalledWith(
        'Ocorreu um erro ao excluir a matrícula. Tente novamente.'
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('navega ao clicar em Cancelar', () => {
    render(
      <MemoryRouter>
        <DeleteEnrollment enrollment={enrollmentMock} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
  });
});
