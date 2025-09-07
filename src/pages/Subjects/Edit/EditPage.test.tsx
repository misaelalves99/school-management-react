// src/pages/Subjects/Edit/EditPage.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SubjectEditPage from "./EditPage";
import { useSubjects } from "../../../hooks/useSubjects";
import { useParams, useNavigate } from "react-router-dom";

// Mock global de alert e navigate
const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});
const navigateMock = jest.fn();

// Mock do hook useSubjects
jest.mock("../../../hooks/useSubjects");

// Mock do react-router-dom
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: jest.fn(),
    useParams: jest.fn(),
  };
});

describe("SubjectEditPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
  });

  // Helper para setar o useParams
  const setUseParams = (id: string | undefined) => {
    (useParams as jest.Mock).mockReturnValue({ id });
  };

  it("mostra alerta e navega se ID não for fornecido", () => {
    setUseParams(undefined);
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(),
      updateSubject: jest.fn(),
    });

    render(
      <MemoryRouter>
        <SubjectEditPage />
      </MemoryRouter>
    );

    expect(alertMock).toHaveBeenCalledWith("ID da disciplina não fornecido.");
    expect(navigateMock).toHaveBeenCalledWith("/subjects");
  });

  it("mostra alerta e navega se disciplina não for encontrada", () => {
    setUseParams("1");
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(() => null),
      updateSubject: jest.fn(),
    });

    render(
      <MemoryRouter>
        <SubjectEditPage />
      </MemoryRouter>
    );

    expect(alertMock).toHaveBeenCalledWith("Disciplina não encontrada.");
    expect(navigateMock).toHaveBeenCalledWith("/subjects");
  });

  it("renderiza formulário preenchido corretamente se disciplina existe", () => {
    setUseParams("1");
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(() => ({
        id: 1,
        name: "Matemática",
        description: "Descrição teste",
        workloadHours: 60,
      })),
      updateSubject: jest.fn(() => true),
    });

    render(
      <MemoryRouter>
        <SubjectEditPage />
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue("Matemática")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Descrição teste")).toBeInTheDocument();
    expect(screen.getByDisplayValue("60")).toBeInTheDocument();
  });

  it("mostra erro de validação se nome estiver vazio", () => {
    setUseParams("1");
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(() => ({
        id: 1,
        name: "",
        description: "",
        workloadHours: 0,
      })),
      updateSubject: jest.fn(),
    });

    render(
      <MemoryRouter>
        <SubjectEditPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Salvar Alterações/i));
    expect(screen.getByText(/O nome da disciplina é obrigatório/i)).toBeInTheDocument();
  });

  it("chama updateSubject e navega após submissão válida", () => {
    const updateSubjectMock = jest.fn(() => true);
    setUseParams("1");

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(() => ({
        id: 1,
        name: "Matemática",
        description: "Descrição teste",
        workloadHours: 60,
      })),
      updateSubject: updateSubjectMock,
    });

    render(
      <MemoryRouter>
        <SubjectEditPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nome da Disciplina/i), { target: { value: "Física" } });
    fireEvent.click(screen.getByText(/Salvar Alterações/i));

    expect(updateSubjectMock).toHaveBeenCalledWith(1, {
      name: "Física",
      description: "Descrição teste",
      workloadHours: 60,
    });
    expect(alertMock).toHaveBeenCalledWith("Disciplina atualizada com sucesso!");
    expect(navigateMock).toHaveBeenCalledWith("/subjects");
  });

  it("mostra alerta se updateSubject retornar false", () => {
    const updateSubjectMock = jest.fn(() => false);
    setUseParams("1");

    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(() => ({
        id: 1,
        name: "Matemática",
        description: "Descrição teste",
        workloadHours: 60,
      })),
      updateSubject: updateSubjectMock,
    });

    render(
      <MemoryRouter>
        <SubjectEditPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Salvar Alterações/i));
    expect(alertMock).toHaveBeenCalledWith("Erro ao atualizar a disciplina.");
  });

  it("botão Voltar navega para /subjects", () => {
    setUseParams("1");
    (useSubjects as jest.Mock).mockReturnValue({
      getSubjectById: jest.fn(() => ({
        id: 1,
        name: "Matemática",
        description: "Descrição teste",
        workloadHours: 60,
      })),
      updateSubject: jest.fn(),
    });

    render(
      <MemoryRouter>
        <SubjectEditPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Voltar/i));
    expect(navigateMock).toHaveBeenCalledWith("/subjects");
  });
});
