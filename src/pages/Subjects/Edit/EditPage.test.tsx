// src/pages/Subjects/Edit/EditPage.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SubjectEditPage from "./EditPage";
import { useSubjects } from "../../../hooks/useSubjects";

jest.mock("../../../hooks/useSubjects");

describe("SubjectEditPage", () => {
  const navigateMock = jest.fn();
  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();

    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => navigateMock,
      useParams: () => ({ id: "1" }),
    }));
  });

  it("mostra alerta e navega se disciplina não for encontrada", () => {
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

    fireEvent.change(screen.getByLabelText(/Nome da Disciplina/i), {
      target: { value: "Física" },
    });

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
});
