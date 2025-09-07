// src/pages/Students/Delete/DeletePage.test.tsx

import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import StudentDelete from './DeletePage';
import { useStudents } from '../../../hooks/useStudents';

const navigateMock = jest.fn();

// Mock do hook useStudents
jest.mock('../../../hooks/useStudents');

// Mock do react-router-dom
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: jest.fn(),
  };
});

import { useParams } from 'react-router-dom';

describe('StudentDelete', () => {
  const removeStudentMock = jest.fn().mockResolvedValue(undefined);
  const studentsMock = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: '2000-01-01',
      enrollmentNumber: '123',
      phone: '',
      address: '',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useStudents as jest.Mock).mockReturnValue({
      students: studentsMock,
      removeStudent: removeStudentMock,
    });
  });

  const renderWithRouter = (id: string | undefined) => {
    (useParams as jest.Mock).mockReturnValue({ id });

    render(
      <MemoryRouter initialEntries={[id ? `/students/delete/${id}` : '/students/delete']}>
        <Routes>
          <Route path="/students/delete/:id" element={<StudentDelete />} />
          <Route path="/students/delete" element={<StudentDelete />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('exibe mensagem de ID inválido se id não for fornecido', () => {
    renderWithRouter(undefined);
    expect(screen.getByText(/ID inválido/i)).toBeInTheDocument();
  });

  it('exibe mensagem de aluno não encontrado se id não existir', () => {
    renderWithRouter('999');
    expect(screen.getByText(/Aluno não encontrado/i)).toBeInTheDocument();
  });

  it('renderiza informações do aluno e botões corretamente', () => {
    renderWithRouter('1');
    expect(screen.getByText(/Excluir Aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/Tem certeza que deseja excluir/i)).toHaveTextContent('John Doe');
    expect(screen.getByText(/^Excluir$/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  it('chama removeStudent, exibe alert e navega ao confirmar exclusão', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderWithRouter('1');

    await act(async () => {
      fireEvent.click(screen.getByText(/^Excluir$/i));
    });

    expect(removeStudentMock).toHaveBeenCalledWith(1);
    expect(alertMock).toHaveBeenCalledWith('Aluno excluído com sucesso!');
    expect(navigateMock).toHaveBeenCalledWith('/students');

    alertMock.mockRestore();
  });

  it('navega ao clicar em Cancelar', () => {
    renderWithRouter('1');
    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(navigateMock).toHaveBeenCalledWith('/students');
  });

  it('exibe alert em caso de erro ao remover aluno', async () => {
    removeStudentMock.mockRejectedValueOnce(new Error('Erro'));
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    renderWithRouter('1');

    await act(async () => {
      fireEvent.click(screen.getByText(/^Excluir$/i));
    });

    expect(alertMock).toHaveBeenCalledWith('Ocorreu um erro ao excluir o aluno.');
    alertMock.mockRestore();
  });
});
