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
    useParams: jest.fn(() => ({ id: '1' })), // valor padrão
  };
});

import { useParams } from 'react-router-dom';

describe('StudentEdit', () => {
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
    (useStudents as jest.Mock).mockReturnValue({
      students: studentsMock,
      editStudent: jest.fn(() => true),
    });
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
    renderWithRouter('999');
    expect(window.alert).toHaveBeenCalledWith('Aluno não encontrado');
    expect(navigateMock).toHaveBeenCalledWith('/students');
  });

  it('preenche o formulário corretamente quando aluno existe', () => {
    renderWithRouter('1');
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/dateOfBirth/i)).toHaveValue('2000-01-01');
    expect(screen.getByLabelText(/enrollmentNumber/i)).toHaveValue('123');
    expect(screen.getByLabelText(/phone/i)).toHaveValue('1111-1111');
    expect(screen.getByLabelText(/address/i)).toHaveValue('Rua A');
  });

  it('valida campos obrigatórios', () => {
    renderWithRouter('1');
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/dateOfBirth/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/enrollmentNumber/i), { target: { value: '' } });
    fireEvent.click(screen.getByText(/Salvar Alterações/i));

    expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Email é obrigatório/i)).toBeInTheDocument();
    expect(screen.getByText(/Data de nascimento é obrigatória/i)).toBeInTheDocument();
    expect(screen.getByText(/Matrícula é obrigatória/i)).toBeInTheDocument();
  });

  it('chama editStudent e navega ao salvar corretamente', () => {
    const editStudentMock = jest.fn(() => true);
    (useStudents as jest.Mock).mockReturnValue({
      students: studentsMock,
      editStudent: editStudentMock,
    });

    renderWithRouter('1');

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByText(/Salvar Alterações/i));

    expect(editStudentMock).toHaveBeenCalledWith(1, expect.objectContaining({ name: 'Jane Doe' }));
    expect(window.alert).toHaveBeenCalledWith('Aluno atualizado com sucesso!');
    expect(navigateMock).toHaveBeenCalledWith('/students');
  });

  it('botão Voltar navega corretamente', () => {
    renderWithRouter('1');
    fireEvent.click(screen.getByText(/Voltar/i));
    expect(navigateMock).toHaveBeenCalledWith('/students');
  });
});
