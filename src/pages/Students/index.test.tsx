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

    fireEvent.change(screen.getByPlaceholderText(/Digite o nome/i), { target: { value: 'alice' } });
    fireEvent.click(screen.getByText(/Buscar/i));

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('chama removeStudent ao clicar em Excluir', () => {
    render(
      <MemoryRouter>
        <StudentIndex />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByText('Excluir')[0]);
    expect(removeStudentMock).toHaveBeenCalledWith(1);
  });

  it('botões de navegação de página funcionam', () => {
    const manyStudents = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      enrollmentNumber: `00${i + 1}`,
      phone: '',
      address: '',
    }));
    (useStudents as jest.Mock).mockReturnValue({
      students: manyStudents,
      removeStudent: removeStudentMock,
      refreshStudents: refreshStudentsMock,
    });

    render(
      <MemoryRouter>
        <StudentIndex />
      </MemoryRouter>
    );

    expect(screen.getByText(/Página 1 de 2/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Próxima/i));
    expect(screen.getByText(/Página 2 de 2/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Anterior/i));
    expect(screen.getByText(/Página 1 de 2/i)).toBeInTheDocument();
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
});
