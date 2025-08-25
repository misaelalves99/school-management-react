// src/pages/Subjects/Delete/DeletePage.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SubjectDeletePage from "./DeletePage";
import { useSubjects } from "../../../hooks/useSubjects";

const navigateMock = jest.fn();

// Mock do hook useSubjects
jest.mock("../../../hooks/useSubjects");

// Mock do react-router-dom
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useParams: () => ({ id: "1" }),
  };
});

describe("SubjectDeletePage", () => {
  const getSubjectByIdMock = jest.fn();
  const deleteSubjectMock = jest.fn();
  const reloadSubjectsMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: getSubjectByIdMock,
      deleteSubject: deleteSubjectMock,
      reloadSubjects: reloadSubjectsMock,
    });
  });

  it("mostra mensagem de ID inválido se id não for fornecido", () => {
    getSubjectByIdMock.mockReturnValue(null);

    render(
      <MemoryRouter>
        <SubjectDeletePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Disciplina não encontrada/i)).toBeInTheDocument();
  });

  it("mostra os dados da disciplina corretamente", () => {
    getSubjectByIdMock.mockReturnValue({
      id: 1,
      name: "Matemática",
      workloadHours: 60,
      description: "Descrição teste",
    });

    render(
      <MemoryRouter>
        <SubjectDeletePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Matemática")).toBeInTheDocument();
    expect(screen.getByText(/Carga Horária: 60 horas/i)).toBeInTheDocument();
    expect(screen.getByText(/Descrição teste/i)).toBeInTheDocument();
  });

  it("não exclui se usuário cancelar confirmação", () => {
    getSubjectByIdMock.mockReturnValue({
      id: 1,
      name: "Matemática",
      workloadHours: 60,
      description: "Descrição teste",
    });
    window.confirm = jest.fn(() => false);
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <SubjectDeletePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Excluir/i));

    expect(deleteSubjectMock).not.toHaveBeenCalled();
    expect(reloadSubjectsMock).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("exclui disciplina com sucesso se usuário confirmar", () => {
    getSubjectByIdMock.mockReturnValue({
      id: 1,
      name: "Matemática",
      workloadHours: 60,
      description: "Descrição teste",
    });
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
    deleteSubjectMock.mockReturnValue(true);

    render(
      <MemoryRouter>
        <SubjectDeletePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Excluir/i));

    expect(deleteSubjectMock).toHaveBeenCalledWith(1);
    expect(reloadSubjectsMock).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith("Disciplina excluída com sucesso!");
    expect(navigateMock).toHaveBeenCalledWith("/subjects");
  });

  it("mostra erro ao excluir se deleteSubject retornar false", () => {
    getSubjectByIdMock.mockReturnValue({
      id: 1,
      name: "Matemática",
      workloadHours: 60,
      description: "Descrição teste",
    });
    window.confirm = jest.fn(() => true);
    window.alert = jest.fn();
    deleteSubjectMock.mockReturnValue(false);

    render(
      <MemoryRouter>
        <SubjectDeletePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Excluir/i));

    expect(deleteSubjectMock).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith("Erro ao excluir a disciplina.");
    expect(reloadSubjectsMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("botão cancelar navega para /subjects", () => {
    getSubjectByIdMock.mockReturnValue({
      id: 1,
      name: "Matemática",
      workloadHours: 60,
      description: "Descrição teste",
    });

    render(
      <MemoryRouter>
        <SubjectDeletePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(navigateMock).toHaveBeenCalledWith("/subjects");
  });
});
