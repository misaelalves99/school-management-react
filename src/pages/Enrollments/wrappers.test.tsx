// src/pages/Enrollments/wrappers.test.tsx
import { render, screen, act, fireEvent } from '@testing-library/react';
import {
  EnrollmentDetailsWrapper,
  EnrollmentEditWrapper,
  EnrollmentDeleteWrapper,
} from './wrappers';
import { MemoryRouter, useParams } from 'react-router-dom';

const mockNavigate = jest.fn();
const mockAlert = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as typeof import('react-router-dom')),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(),
}));

jest.spyOn(window, 'alert').mockImplementation(mockAlert);

// Mock dos hooks
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

describe('Enrollment Wrappers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
  });

  it('EnrollmentDetailsWrapper exibe detalhes corretamente', async () => {
    render(
      <MemoryRouter>
        <EnrollmentDetailsWrapper />
      </MemoryRouter>
    );

    expect(await screen.findByText(/João/)).toBeInTheDocument();
    expect(screen.getByText(/Sala A/)).toBeInTheDocument();
  });

  it('EnrollmentEditWrapper exibe formulário de edição e chama onSave', async () => {
    render(
      <MemoryRouter>
        <EnrollmentEditWrapper />
      </MemoryRouter>
    );

    const input = await screen.findByLabelText(/Aluno/);
    fireEvent.change(input, { target: { value: 1 } });

    const form = screen.getByRole('form') || screen.getByText(/Salvar Alterações/).closest('form');
    await act(async () => {
      fireEvent.submit(form!);
    });

    expect(updateEnrollmentMock).toHaveBeenCalled();
  });

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
