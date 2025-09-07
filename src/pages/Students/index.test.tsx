// src/pages/Students/index.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import StudentIndex from './index';
import { useStudents } from '../../hooks/useStudents';

jest.mock('../../hooks/useStudents');

describe('StudentIndex', () => {
  const studentsMock = [
    { id: 1, name: 'Alice', enrollmentNumber: '001', phone: '1111-1111', address: 'Rua A' },
    { id: 2, name: 'Bob', enrollmentNumber: '002', phone: '', address: '' },
  ];

  const removeStudentMock = jest.fn();
  const refreshStudentsMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useStudents as jest.Mock).mockReturnValue({
      students: studentsMock,
      removeStudent: removeStudentMock,
      refreshStudents: refreshStudentsMock,
    });

    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('chama refreshStudents ao montar', () => {
    render(
      <MemoryRouter>
        <StudentIndex />
      </MemoryRouter>
    );
    expect(refreshStudentsMock).toHaveBeenCalled();
  });

  it('exibe lista de alunos corretamente', () => {
    render(
      <MemoryRouter>
        <StudentIndex />
      </MemoryRouter>
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('filtra alunos pelo nome', () => {
    render(
      <MemoryRouter>
        <StudentIndex />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Digite o nome do aluno/i), {
      target: { value: 'alice' },
    });

    // Não há necessidade de clicar no botão "Buscar", o filtro ocorre no input
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('botão Cadastrar Novo Aluno existe e tem link correto', () => {
    render(
      <MemoryRouter>
        <StudentIndex />
      </MemoryRouter>
    );

    const createButton = screen.getByText(/Cadastrar Novo Aluno/i);
    expect(createButton).toBeInTheDocument();
    expect(createButton.closest('a')).toHaveAttribute('href', '/students/create');
  });

  it('exibe mensagem quando não há alunos', () => {
    (useStudents as jest.Mock).mockReturnValue({
      students: [],
      removeStudent: removeStudentMock,
      refreshStudents: refreshStudentsMock,
    });

    render(
      <MemoryRouter>
        <StudentIndex />
      </MemoryRouter>
    );

    expect(screen.getByText(/Nenhum aluno encontrado/i)).toBeInTheDocument();
  });

  it('links de ações têm URLs corretas', () => {
    render(
      <MemoryRouter>
        <StudentIndex />
      </MemoryRouter>
    );

    const detailLink = screen.getByText('Detalhes').closest('a');
    const editLink = screen.getByText('Editar').closest('a');
    const deleteLink = screen.getByText('Excluir').closest('a');

    expect(detailLink).toHaveAttribute('href', '/students/details/1');
    expect(editLink).toHaveAttribute('href', '/students/edit/1');
    expect(deleteLink).toHaveAttribute('href', '/students/delete/1');
  });
});
