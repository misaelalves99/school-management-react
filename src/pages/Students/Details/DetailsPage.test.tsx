// src/pages/Students/Details/DetailsPage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import StudentDetails from './DetailsPage';
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

describe('StudentDetails', () => {
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
    (useStudents as jest.Mock).mockReturnValue({ students: studentsMock });
  });

  const renderWithRouter = (id?: string) => {
    (useParams as jest.Mock).mockReturnValue({ id });

    render(
      <MemoryRouter initialEntries={[id ? `/students/details/${id}` : '/students/details']}>
        <Routes>
          <Route path="/students/details/:id" element={<StudentDetails />} />
          <Route path="/students/details" element={<StudentDetails />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('exibe mensagem quando ID não é fornecido', () => {
    renderWithRouter();
    expect(screen.getByText(/ID do aluno não fornecido/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Voltar à Lista/i));
    expect(navigateMock).toHaveBeenCalledWith('/students');
  });

  it('exibe mensagem quando aluno não é encontrado', () => {
    renderWithRouter('999');
    expect(screen.getByText(/Aluno não encontrado/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Voltar à Lista/i));
    expect(navigateMock).toHaveBeenCalledWith('/students');
  });

  it('exibe detalhes do aluno corretamente', () => {
    renderWithRouter('1');

    expect(screen.getByText(/Detalhes do Aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/Nome:/i).nextSibling?.textContent).toBe(' John Doe');
    expect(screen.getByText(/Email:/i).nextSibling?.textContent).toBe(' john@example.com');
    expect(screen.getByText(/Data de Nascimento:/i).nextSibling?.textContent).toBe(' 2000-01-01');
    expect(screen.getByText(/Número de Matrícula:/i).nextSibling?.textContent).toBe(' 123');
    expect(screen.getByText(/Telefone:/i).nextSibling?.textContent).toBe(' 1111-1111');
    expect(screen.getByText(/Endereço:/i).nextSibling?.textContent).toBe(' Rua A');
  });

  it('botão Editar chama navigate corretamente', () => {
    renderWithRouter('1');
    fireEvent.click(screen.getByText(/Editar/i));
    expect(navigateMock).toHaveBeenCalledWith('/students/edit/1');
  });

  it('botão Voltar chama navigate corretamente', () => {
    renderWithRouter('1');
    fireEvent.click(screen.getByText(/Voltar à Lista/i));
    expect(navigateMock).toHaveBeenCalledWith('/students');
  });
});
