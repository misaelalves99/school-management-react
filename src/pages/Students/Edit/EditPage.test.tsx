// src/pages/Students/Edit/EditPage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import StudentEdit from './EditPage';
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
    useParams: jest.fn(() => ({ id: '1' })),
  };
});

import { useParams } from 'react-router-dom';

describe('StudentEditPage', () => {
  const studentsMock = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: '2000-01-01',
      enrollmentNumber: '123',
      phone: '1111-1111',
      address: 'Rua A',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  const renderWithRouter = (id?: string) => {
    (useParams as jest.Mock).mockReturnValue({ id });

    render(
      <MemoryRouter initialEntries={[id ? `/students/edit/${id}` : '/students/edit']}>
        <Routes>
          <Route path="/students/edit/:id" element={<StudentEdit />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('exibe alerta e navega quando aluno não encontrado', () => {
    (useStudents as jest.Mock).mockReturnValue({ students: [], editStudent: jest.fn() });
    renderWithRouter('999');

    expect(window.alert).toHaveBeenCalledWith('Aluno não encontrado');
    expect(navigateMock).toHaveBeenCalledWith('/students');
  });

  it('preenche o formulário corretamente quando aluno existe', () => {
    (useStudents as jest.Mock).mockReturnValue({ students: studentsMock, editStudent: jest.fn() });
    renderWithRouter('1');

    expect(screen.getByLabelText(/Nome/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/Data de Nascimento/i)).toHaveValue('2000-01-01');
    expect(screen.getByLabelText(/Matrícula/i)).toHaveValue('123');
    expect(screen.getByLabelText(/Telefone/i)).toHaveValue('1111-1111');
    expect(screen.getByLabelText(/Endereço/i)).toHaveValue('Rua A');
  });

  it('valida campos obrigatórios', () => {
    (useStudents as jest.Mock).mockReturnValue({ students: studentsMock, editStudent: jest.fn() });
    renderWithRouter('1');

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Data de Nascimento/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/Matrícula/i), { target: { value: '' } });

    fireEvent.click(screen.getByText(/Salvar Alterações/i));

    expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Email é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Data de nascimento é obrigatória/i)).toBeInTheDocument();
    expect(screen.getByText(/Matrícula é obrigatória/i)).toBeInTheDocument();
  });

  it('chama editStudent e navega ao salvar corretamente', () => {
    const editStudentMock = jest.fn(() => true);
    (useStudents as jest.Mock).mockReturnValue({ students: studentsMock, editStudent: editStudentMock });

    renderWithRouter('1');

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByText(/Salvar Alterações/i));

    expect(editStudentMock).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Jane Doe' }));
    expect(window.alert).toHaveBeenCalledWith('Aluno atualizado com sucesso!');
    expect(navigateMock).toHaveBeenCalledWith('/students');
  });

  it('botão Voltar navega corretamente', () => {
    (useStudents as jest.Mock).mockReturnValue({ students: studentsMock, editStudent: jest.fn() });
    renderWithRouter('1');

    fireEvent.click(screen.getByText(/Voltar/i));
    expect(navigateMock).toHaveBeenCalledWith('/students');
  });
});
