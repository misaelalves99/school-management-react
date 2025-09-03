// src/pages/Students/Create/CreatePage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import StudentCreatePage from './CreatePage';
import { useStudents } from '../../../hooks/useStudents';
import { MemoryRouter } from 'react-router-dom';

const navigateMock = jest.fn();

// Mock do hook useStudents
jest.mock('../../../hooks/useStudents');
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as typeof import('react-router-dom')),
  useNavigate: () => navigateMock,
}));

describe('StudentCreatePage', () => {
  const addStudentMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStudents as jest.Mock).mockReturnValue({
      addStudent: addStudentMock,
    });
  });

  it('renderiza todos os campos do formulário', () => {
    render(
      <MemoryRouter>
        <StudentCreatePage />
      </MemoryRouter>
    );

    const fields = ['Nome', 'Email', 'Data de Nascimento', 'Matrícula', 'Telefone', 'Endereço'];
    fields.forEach(field => {
      expect(screen.getByLabelText(new RegExp(field, 'i'))).toBeInTheDocument();
    });
  });

  it('mostra erros ao tentar submeter com campos obrigatórios vazios', () => {
    render(
      <MemoryRouter>
        <StudentCreatePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Salvar/i));

    expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Email é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Data de nascimento é obrigatória/i)).toBeInTheDocument();
    expect(screen.getByText(/Matrícula é obrigatória/i)).toBeInTheDocument();
  });

  it('mostra erro para email inválido', () => {
    render(
      <MemoryRouter>
        <StudentCreatePage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByText(/Salvar/i));

    expect(screen.getByText(/Email inválido/i)).toBeInTheDocument();
    expect(addStudentMock).not.toHaveBeenCalled();
  });

  it('chama addStudent e navegação ao submeter formulário válido', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <StudentCreatePage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Matrícula/i), { target: { value: '12345' } });

    fireEvent.click(screen.getByText(/Salvar/i));

    expect(addStudentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        dateOfBirth: '2000-01-01',
        enrollmentNumber: '12345',
      })
    );

    expect(alertMock).toHaveBeenCalledWith('Aluno cadastrado com sucesso!');
    expect(navigateMock).toHaveBeenCalledWith('/students');

    alertMock.mockRestore();
  });

  it('navega de volta ao clicar em Voltar', () => {
    render(
      <MemoryRouter>
        <StudentCreatePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Voltar/i));
    expect(navigateMock).toHaveBeenCalledWith('/students');
  });
});
