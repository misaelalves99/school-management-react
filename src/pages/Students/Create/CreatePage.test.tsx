// src/pages/Students/Create/CreatePage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

    const fields = [
      'Nome',
      'Email',
      'Data de Nascimento',
      'Matrícula',
      'Telefone',
      'Endereço',
    ];
    fields.forEach(field => {
      expect(screen.getByLabelText(new RegExp(field, 'i'))).toBeInTheDocument();
    });
  });

  it('mostra erros ao submeter com campos obrigatórios vazios', async () => {
    render(
      <MemoryRouter>
        <StudentCreatePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Salvar/i));

    expect(await screen.findByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Email é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Data de nascimento é obrigatória/i)).toBeInTheDocument();
    expect(screen.getByText(/Matrícula é obrigatória/i)).toBeInTheDocument();
    expect(addStudentMock).not.toHaveBeenCalled();
  });

  it('mostra erro para email inválido', async () => {
    render(
      <MemoryRouter>
        <StudentCreatePage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByText(/Salvar/i));

    expect(await screen.findByText(/Email inválido/i)).toBeInTheDocument();
    expect(addStudentMock).not.toHaveBeenCalled();
  });

  it('chama addStudent e navegação ao submeter formulário válido', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <StudentCreatePage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento/i), {
      target: { value: '2000-01-01' },
    });
    fireEvent.change(screen.getByLabelText(/Matrícula/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/Telefone/i), { target: { value: '555-1234' } });
    fireEvent.change(screen.getByLabelText(/Endereço/i), { target: { value: 'Rua A, 123' } });

    fireEvent.click(screen.getByText(/Salvar/i));

    await waitFor(() => {
      expect(addStudentMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          dateOfBirth: '2000-01-01',
          enrollmentNumber: '12345',
          phone: '555-1234',
          address: 'Rua A, 123',
        })
      );
      expect(alertMock).toHaveBeenCalledWith('Aluno cadastrado com sucesso!');
      expect(navigateMock).toHaveBeenCalledWith('/students');
    });

    alertMock.mockRestore();
  });

  it('mostra alerta quando addStudent lança erro', async () => {
    addStudentMock.mockRejectedValueOnce(new Error('Falha'));
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

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Ocorreu um erro ao cadastrar o aluno.');
    });

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
