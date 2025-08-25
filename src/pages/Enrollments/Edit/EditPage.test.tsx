// src/pages/Enrollments/Edit/EditPage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import EditEnrollment from './EditPage';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('EditEnrollment', () => {
  const enrollmentMock = {
    id: 1,
    studentId: 1,
    classRoomId: 2,
    enrollmentDate: '2025-01-10',
    status: 'Ativa', // Pode ser ignorado se não usado no form
  };

  const onSaveMock = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente os campos do formulário com valores iniciais', () => {
    render(
      <MemoryRouter>
        <EditEnrollment enrollment={enrollmentMock} onSave={onSaveMock} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Aluno/i)).toHaveValue(enrollmentMock.studentId);
    expect(screen.getByLabelText(/Turma/i)).toHaveValue(enrollmentMock.classRoomId);
    expect(screen.getByLabelText(/Data da Matrícula/i)).toHaveValue(enrollmentMock.enrollmentDate);
  });

  it('valida campos obrigatórios e mostra mensagens de erro', async () => {
    render(
      <MemoryRouter>
        <EditEnrollment enrollment={{ ...enrollmentMock, studentId: 0, classRoomId: 0, enrollmentDate: '' }} onSave={onSaveMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Salvar Alterações/i));

    expect(await screen.findByText(/Aluno é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Turma é obrigatória/i)).toBeInTheDocument();
    expect(screen.getByText(/Data da matrícula é obrigatória/i)).toBeInTheDocument();
    expect(onSaveMock).not.toHaveBeenCalled();
  });

  it('chama onSave com os dados corretos ao enviar formulário válido', async () => {
    render(
      <MemoryRouter>
        <EditEnrollment enrollment={enrollmentMock} onSave={onSaveMock} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Aluno/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/Turma/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/Data da Matrícula/i), { target: { value: '2025-02-01' } });

    fireEvent.click(screen.getByText(/Salvar Alterações/i));

    expect(onSaveMock).toHaveBeenCalledWith({
      ...enrollmentMock,
      studentId: 3,
      classRoomId: 4,
      enrollmentDate: '2025-02-01',
    });
  });

  it('navega para a lista ao clicar em Voltar à Lista', () => {
    render(
      <MemoryRouter>
        <EditEnrollment enrollment={enrollmentMock} onSave={onSaveMock} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Voltar à Lista/i));
    expect(mockNavigate).toHaveBeenCalledWith('/enrollments');
  });
});
