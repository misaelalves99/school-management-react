// src/pages/Subjects/Delete/DeletePage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SubjectDeletePage from './DeletePage';
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
    useParams: jest.fn(),
  };
});

import { useParams } from 'react-router-dom';

describe('SubjectDeletePage', () => {
  const getSubjectByIdMock = jest.fn();
  const deleteSubjectMock = jest.fn();
  const reloadSubjectsMock = jest.fn();

  const renderWithRouter = (id?: string) => {
    (useParams as jest.Mock).mockReturnValue({ id });

    render(
      <MemoryRouter initialEntries={[id ? `/subjects/delete/${id}` : '/subjects/delete']}>
        <Routes>
          <Route path="/subjects/delete/:id" element={<SubjectDeletePage />} />
          <Route path="/subjects/delete" element={<SubjectDeletePage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: getSubjectByIdMock,
      deleteSubject: deleteSubjectMock,
      reloadSubjects: reloadSubjectsMock,
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('exibe mensagem de ID inválido quando não há id', () => {
    renderWithRouter(undefined);

    expect(screen.getByText(/ID inválido/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Voltar/i));
    expect(navigateMock).toHaveBeenCalledWith('/subjects');
  });

  it('exibe mensagem quando disciplina não existe', () => {
    getSubjectByIdMock.mockReturnValue(undefined);
    renderWithRouter('999');

    expect(screen.getByText(/Disciplina não encontrada/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Voltar/i));
    expect(navigateMock).toHaveBeenCalledWith('/subjects');
  });

  it('renderiza detalhes da disciplina e botões corretamente', () => {
    const subject = { id: 1, name: 'Matemática', description: 'Descrição teste', workloadHours: 60 };
    getSubjectByIdMock.mockReturnValue(subject);

    renderWithRouter('1');

    expect(screen.getByText(/Excluir Disciplina/i)).toBeInTheDocument();
    expect(screen.getByText(/Matemática/i)).toBeInTheDocument();
    expect(screen.getByText(/Excluir/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
  });

  it('chama deleteSubject, reloadSubjects, alerta e navega ao excluir', () => {
    const subject = { id: 1, name: 'Matemática', description: '', workloadHours: 60 };
    getSubjectByIdMock.mockReturnValue(subject);
    deleteSubjectMock.mockReturnValue(true);

    renderWithRouter('1');

    fireEvent.click(screen.getByText(/Excluir/i));

    expect(deleteSubjectMock).toHaveBeenCalledWith(1);
    expect(reloadSubjectsMock).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Disciplina excluída com sucesso!');
    expect(navigateMock).toHaveBeenCalledWith('/subjects');
  });

  it('exibe alerta de erro se deleteSubject falhar', () => {
    const subject = { id: 1, name: 'Matemática', description: '', workloadHours: 60 };
    getSubjectByIdMock.mockReturnValue(subject);
    deleteSubjectMock.mockReturnValue(false);

    renderWithRouter('1');

    fireEvent.click(screen.getByText(/Excluir/i));

    expect(window.alert).toHaveBeenCalledWith('Erro ao excluir a disciplina.');
    expect(navigateMock).not.toHaveBeenCalled();
    expect(reloadSubjectsMock).not.toHaveBeenCalled();
  });

  it('botão Cancelar navega corretamente', () => {
    const subject = { id: 1, name: 'Matemática', description: '', workloadHours: 60 };
    getSubjectByIdMock.mockReturnValue(subject);

    renderWithRouter('1');

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(navigateMock).toHaveBeenCalledWith('/subjects');
  });
});
