// src/pages/Enrollments/wrappers.test.tsx

import { render, screen, fireEvent, act } from '@testing-library/react';
import {
  EnrollmentDetailsWrapper,
  EnrollmentEditWrapper,
  EnrollmentDeleteWrapper,
} from './wrappers';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
const mockAlert = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as typeof import('react-router-dom')),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

jest.spyOn(window, 'alert').mockImplementation(mockAlert);

// Mocks dos hooks
const mockEnrollments = [
  { id: 1, studentId: 1, classRoomId: 1, enrollmentDate: '2025-01-01', status: 'Ativa' },
];
const mockStudents = [{ id: 1, name: 'João' }];
const mockClassRooms = [{ id: 1, name: 'Sala A' }];

const updateEnrollmentMock = jest.fn().mockResolvedValue(mockEnrollments[0]);
const removeEnrollmentMock = jest.fn().mockResolvedValue(undefined);

jest.mock('../../hooks/useEnrollments', () => ({
  useEnrollments: () => ({
    enrollments: mockEnrollments,
    updateEnrollment: updateEnrollmentMock,
    removeEnrollment: removeEnrollmentMock,
  }),
}));

jest.mock('../../hooks/useStudents', () => ({
  useStudents: () => ({ students: mockStudents }),
}));

jest.mock('../../hooks/useClassRooms', () => ({
  useClassRooms: () => ({ classRooms: mockClassRooms }),
}));

import { useParams } from 'react-router-dom';

describe('Enrollment Wrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
  });

  // ===================== Details =====================
  it('EnrollmentDetailsWrapper exibe detalhes corretamente', async () => {
    render(
      <MemoryRouter>
        <EnrollmentDetailsWrapper />
      </MemoryRouter>
    );

    expect(await screen.findByText(/João/)).toBeInTheDocument();
    expect(screen.getByText(/Sala A/)).toBeInTheDocument();
    expect(screen.getByText(/Ativa/)).toBeInTheDocument();
    expect(screen.getByText(/01\/01\/2025/)).toBeInTheDocument();
  });

  // ===================== Edit =====================
  it('EnrollmentEditWrapper exibe formulário e chama onSave', async () => {
    render(
      <MemoryRouter>
        <EnrollmentEditWrapper />
      </MemoryRouter>
    );

    const studentSelect = await screen.findByLabelText(/Aluno/);
    fireEvent.change(studentSelect, { target: { value: '1' } });

    const dateInput = screen.getByLabelText(/Data da Matrícula/);
    fireEvent.change(dateInput, { target: { value: '2025-02-01' } });

    const saveButton = screen.getByText(/Salvar Alterações/);
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(updateEnrollmentMock).toHaveBeenCalledWith({
      id: 1,
      studentId: 1,
      classRoomId: 1,
      enrollmentDate: '2025-02-01',
      status: 'Ativa',
    });
    expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
  });

  it('EnrollmentEditWrapper alerta quando matrícula não encontrada', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '999' });

    render(
      <MemoryRouter>
        <EnrollmentEditWrapper />
      </MemoryRouter>
    );

    expect(mockAlert).toHaveBeenCalledWith('Matrícula não encontrada');
    expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
  });

  it('EnrollmentEditWrapper mostra alert em caso de erro no update', async () => {
    updateEnrollmentMock.mockRejectedValueOnce(new Error('Falha ao atualizar'));

    render(
      <MemoryRouter>
        <EnrollmentEditWrapper />
      </MemoryRouter>
    );

    const saveButton = await screen.findByText(/Salvar Alterações/);
    await act(async () => {
      fireEvent.click(saveButton);
    });

    expect(mockAlert).toHaveBeenCalledWith('Ocorreu um erro ao salvar a matrícula.');
  });

  // ===================== Delete =====================
  it('EnrollmentDeleteWrapper exibe matrícula e chama onDelete', async () => {
    render(
      <MemoryRouter>
        <EnrollmentDeleteWrapper />
      </MemoryRouter>
    );

    expect(await screen.findByText(/João/)).toBeInTheDocument();

    const deleteButton = screen.getByText(/Excluir/);
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(removeEnrollmentMock).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
  });

  it('EnrollmentDeleteWrapper alerta quando matrícula não encontrada', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: '999' });

    render(
      <MemoryRouter>
        <EnrollmentDeleteWrapper />
      </MemoryRouter>
    );

    expect(mockAlert).toHaveBeenCalledWith('Matrícula não encontrada');
    expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
  });

  it('EnrollmentDeleteWrapper mostra alert em caso de erro no delete', async () => {
    removeEnrollmentMock.mockRejectedValueOnce(new Error('Falha ao excluir'));

    render(
      <MemoryRouter>
        <EnrollmentDeleteWrapper />
      </MemoryRouter>
    );

    const deleteButton = await screen.findByText(/Excluir/);
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    expect(mockAlert).toHaveBeenCalledWith('Ocorreu um erro ao excluir a matrícula.');
  });

  // ===================== ID não informado =====================
  it('navega para /enrollments quando id não informado', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: undefined });

    render(
      <MemoryRouter>
        <EnrollmentDetailsWrapper />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
  });
});
