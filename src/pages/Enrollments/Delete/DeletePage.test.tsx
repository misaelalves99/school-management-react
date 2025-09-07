import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteEnrollment from './DeletePage';
import { MemoryRouter } from 'react-router-dom';
import type { EnrollmentWithNames } from '../../../types/EnrollmentWithNames';

const mockNavigate = jest.fn();
const mockAlert = jest.fn();

// Mock do useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeAll(() => {
  window.alert = mockAlert;
});

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
    expect(screen.getByText(/Tem certeza que deseja excluir/i)).toHaveTextContent(
      `Tem certeza que deseja excluir ${enrollmentMock.studentName}?`
    );
    expect(screen.getByText(/Excluir/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  it('chama onDelete e navega ao clicar em Excluir', async () => {
    onDeleteMock.mockResolvedValueOnce();

    render(
      <MemoryRouter>
        <DeleteEnrollment enrollment={enrollmentMock} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Excluir/i));

    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledWith(enrollmentMock.id);
      expect(mockAlert).toHaveBeenCalledWith('Matrícula excluída com sucesso!');
      expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
    });
  });

  it('exibe alerta ao falhar na exclusão', async () => {
    onDeleteMock.mockRejectedValueOnce(new Error('Falha'));

    render(
      <MemoryRouter>
        <DeleteEnrollment enrollment={enrollmentMock} onDelete={onDeleteMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Excluir/i));

    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledWith(enrollmentMock.id);
      expect(mockAlert).toHaveBeenCalledWith(
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
