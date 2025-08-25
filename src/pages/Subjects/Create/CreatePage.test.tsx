// src/pages/Subjects/Create/CreatePage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateSubject from './CreatePage';
import { useSubjects } from '../../../hooks/useSubjects';

const navigateMock = jest.fn();

// Mock do hook useSubjects
jest.mock('../../../hooks/useSubjects');

// Mock do react-router-dom
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('CreateSubject', () => {
  const createSubjectMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSubjects as jest.Mock).mockReturnValue({
      createSubject: createSubjectMock,
    });
  });

  it('renderiza o formulário corretamente', () => {
    render(
      <MemoryRouter>
        <CreateSubject />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Nome da Disciplina/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Carga Horária/i)).toBeInTheDocument();
    expect(screen.getByText(/Salvar/i)).toBeInTheDocument();
    expect(screen.getByText(/Voltar à Lista/i)).toBeInTheDocument();
  });

  it('exibe erro quando nome da disciplina está vazio', () => {
    render(
      <MemoryRouter>
        <CreateSubject />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nome da Disciplina/i), { target: { value: '' } });
    fireEvent.click(screen.getByText(/Salvar/i));

    expect(screen.getByText(/O nome da disciplina é obrigatório/i)).toBeInTheDocument();
    expect(createSubjectMock).not.toHaveBeenCalled();
  });

  it('chama createSubject e navegação quando formulário é válido', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <CreateSubject />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nome da Disciplina/i), { target: { value: 'Matemática' } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'Descrição teste' } });
    fireEvent.change(screen.getByLabelText(/Carga Horária/i), { target: { value: '60' } });

    fireEvent.click(screen.getByText(/Salvar/i));

    expect(createSubjectMock).toHaveBeenCalledWith({
      name: 'Matemática',
      description: 'Descrição teste',
      workloadHours: 60,
    });
    expect(alertMock).toHaveBeenCalledWith('Disciplina cadastrada com sucesso!');
    expect(navigateMock).toHaveBeenCalledWith('/subjects');

    alertMock.mockRestore();
  });

  it('botão de voltar chama navigate', () => {
    render(
      <MemoryRouter>
        <CreateSubject />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Voltar à Lista/i));
    expect(navigateMock).toHaveBeenCalledWith('/subjects');
  });
});
