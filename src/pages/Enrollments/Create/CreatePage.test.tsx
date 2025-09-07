// src/pages/Enrollments/Create/CreatePage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateEnrollmentPage from './CreatePage';
import { useStudents } from '../../../hooks/useStudents';
import { useClassRooms } from '../../../hooks/useClassRooms';
import { useEnrollments } from '../../../hooks/useEnrollments';

jest.mock('../../../hooks/useStudents');
jest.mock('../../../hooks/useClassRooms');
jest.mock('../../../hooks/useEnrollments');

const mockNavigate = jest.fn();
const mockAlert = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeAll(() => {
  window.alert = mockAlert;
});

describe('CreateEnrollmentPage', () => {
  const studentsMock = [{ id: 1, name: 'João' }];
  const classRoomsMock = [{ id: 1, name: 'Sala A' }];
  const createEnrollmentMock = jest.fn();

  beforeEach(() => {
    (useStudents as jest.Mock).mockReturnValue({ students: studentsMock });
    (useClassRooms as jest.Mock).mockReturnValue({ classRooms: classRoomsMock });
    (useEnrollments as jest.Mock).mockReturnValue({ createEnrollment: createEnrollmentMock });

    mockNavigate.mockClear();
    createEnrollmentMock.mockClear();
    mockAlert.mockClear();
  });

  it('renderiza formulário com alunos, turmas e data', () => {
    render(
      <MemoryRouter>
        <CreateEnrollmentPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Aluno/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Turma/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data da Matrícula/i)).toBeInTheDocument();
    expect(screen.getByText(/Salvar/i)).toBeInTheDocument();

    const today = new Date().toISOString().slice(0, 10);
    expect(screen.getByLabelText(/Data da Matrícula/i)).toHaveValue(today);
  });

  it('mostra erro quando campos obrigatórios não são preenchidos', async () => {
    render(
      <MemoryRouter>
        <CreateEnrollmentPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Aluno/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Turma/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Data da Matrícula/i), { target: { value: '' } });

    fireEvent.click(screen.getByText(/Salvar/i));

    expect(await screen.findByText(/Aluno é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/Turma é obrigatória/i)).toBeInTheDocument();
    expect(await screen.findByText(/Data da matrícula é obrigatória/i)).toBeInTheDocument();
    expect(createEnrollmentMock).not.toHaveBeenCalled();
  });

  it('chama createEnrollment e navega ao enviar formulário válido', async () => {
    render(
      <MemoryRouter>
        <CreateEnrollmentPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Aluno/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Turma/i), { target: { value: '1' } });

    fireEvent.click(screen.getByText(/Salvar/i));

    await waitFor(() => {
      expect(createEnrollmentMock).toHaveBeenCalledWith(
        expect.objectContaining({ studentId: 1, classRoomId: 1 })
      );
      expect(mockAlert).toHaveBeenCalledWith('Matrícula criada com sucesso!');
      expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
    });
  });

  it('exibe alerta de erro quando createEnrollment falha', async () => {
    createEnrollmentMock.mockImplementation(() => {
      throw new Error('Falha ao criar matrícula');
    });

    render(
      <MemoryRouter>
        <CreateEnrollmentPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Aluno/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Turma/i), { target: { value: '1' } });

    fireEvent.click(screen.getByText(/Salvar/i));

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Ocorreu um erro ao criar a matrícula.');
    });
  });

  it('mostra "Carregando..." quando não há alunos ou turmas', () => {
    (useStudents as jest.Mock).mockReturnValue({ students: [] });
    (useClassRooms as jest.Mock).mockReturnValue({ classRooms: [] });

    render(
      <MemoryRouter>
        <CreateEnrollmentPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();
  });

  it('botão Voltar navega corretamente', () => {
    render(
      <MemoryRouter>
        <CreateEnrollmentPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Voltar/i));
    expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
  });
});
