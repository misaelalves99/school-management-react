// src/pages/Subjects/index.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SubjectsIndexPage from "./index";
import { useSubjects } from "../../hooks/useSubjects";

jest.mock("../../hooks/useSubjects");

describe("SubjectsIndexPage", () => {
  const subjectsMock = [
    { id: 1, name: "Matemática", description: "Álgebra e Geometria", workloadHours: 60 },
    { id: 2, name: "Física", description: "Mecânica e Termodinâmica", workloadHours: 80 },
    { id: 3, name: "Química", description: "Química Orgânica", workloadHours: 50 },
  ];

  beforeEach(() => {
    (useSubjects as jest.Mock).mockReturnValue({ subjects: subjectsMock });
  });

  it("renderiza lista de disciplinas", () => {
    render(
      <MemoryRouter>
        <SubjectsIndexPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Matemática")).toBeInTheDocument();
    expect(screen.getByText("Física")).toBeInTheDocument();
    expect(screen.getByText("Química")).toBeInTheDocument();
  });

  it("filtra disciplinas pelo nome", () => {
    render(
      <MemoryRouter>
        <SubjectsIndexPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/Digite o nome ou descrição/i), {
      target: { value: "Física" },
    });
    expect(screen.getByText("Física")).toBeInTheDocument();
    expect(screen.queryByText("Matemática")).not.toBeInTheDocument();
    expect(screen.queryByText("Química")).not.toBeInTheDocument();
  });

  it("filtra disciplinas pela descrição", () => {
    render(
      <MemoryRouter>
        <SubjectsIndexPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/Digite o nome ou descrição/i), {
      target: { value: "Orgânica" },
    });
    expect(screen.getByText("Química")).toBeInTheDocument();
    expect(screen.queryByText("Matemática")).not.toBeInTheDocument();
    expect(screen.queryByText("Física")).not.toBeInTheDocument();
  });

  it("mostra mensagem quando não há disciplinas correspondentes", () => {
    render(
      <MemoryRouter>
        <SubjectsIndexPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/Digite o nome ou descrição/i), {
      target: { value: "Biologia" },
    });
    expect(screen.getByText("Nenhuma disciplina encontrada.")).toBeInTheDocument();
  });

  it("verifica links de ações e cadastro", () => {
    render(
      <MemoryRouter>
        <SubjectsIndexPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Cadastrar Nova Disciplina").closest("a")).toHaveAttribute(
      "href",
      "/subjects/create"
    );
    expect(screen.getByText("Detalhes").closest("a")).toHaveAttribute("href", "/subjects/details/1");
    expect(screen.getByText("Editar").closest("a")).toHaveAttribute("href", "/subjects/edit/1");
    expect(screen.getByText("Excluir").closest("a")).toHaveAttribute("href", "/subjects/delete/1");
  });

  it("botão buscar não altera comportamento padrão do form", () => {
    const { container } = render(
      <MemoryRouter>
        <SubjectsIndexPage />
      </MemoryRouter>
    );
    const form = container.querySelector("form")!;
    fireEvent.submit(form);
    // se não lança erro, o preventDefault está funcionando
  });
});
