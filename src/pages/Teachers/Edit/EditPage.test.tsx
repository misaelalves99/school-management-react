// src/pages/Teachers/Edit/EditPage.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TeacherEdit from "./EditPage";
import { useTeachers } from "../../../hooks/useTeachers";

const navigateMock = jest.fn();

jest.mock("../../../hooks/useTeachers");
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("TeacherEdit", () => {
  const getTeacherMock = jest.fn();
  const editTeacherMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacher: getTeacherMock,
      editTeacher: editTeacherMock,
    });
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  const renderComponent = (id?: string) =>
    render(
      <MemoryRouter initialEntries={[id ? `/teachers/edit/${id}` : "/teachers/edit"]}>
        <Routes>
          <Route path="/teachers/edit/:id" element={<TeacherEdit />} />
        </Routes>
      </MemoryRouter>
    );

  it("exibe 'Carregando...' inicialmente", () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      dateOfBirth: "1980-05-10",
      subject: "Matemática",
      phone: "123",
      address: "Rua A",
    });
    renderComponent("1");
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("alerta e navega se professor não encontrado", () => {
    getTeacherMock.mockReturnValue(undefined);
    renderComponent("1");
    expect(window.alert).toHaveBeenCalledWith("Professor não encontrado");
    expect(navigateMock).toHaveBeenCalledWith("/teachers");
  });

  it("preenche os campos com os dados do professor", async () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      dateOfBirth: "1980-05-10",
      subject: "Matemática",
      phone: "123",
      address: "Rua A",
    });
    renderComponent("1");
    await waitFor(() => {
      expect(screen.getByDisplayValue("Professor X")).toBeInTheDocument();
      expect(screen.getByDisplayValue("x@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1980-05-10")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Matemática")).toBeInTheDocument();
      expect(screen.getByDisplayValue("123")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Rua A")).toBeInTheDocument();
    });
  });

  it("mostra erros de validação se campos obrigatórios estiverem vazios", async () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "",
      email: "",
      dateOfBirth: "",
      subject: "",
      phone: "",
      address: "",
    });
    renderComponent("1");
    fireEvent.click(screen.getByText("Salvar"));
    await waitFor(() => {
      expect(screen.getByText("Nome é obrigatório.")).toBeInTheDocument();
      expect(screen.getByText("Email é obrigatório.")).toBeInTheDocument();
      expect(screen.getByText("Data de nascimento é obrigatória.")).toBeInTheDocument();
      expect(screen.getByText("Disciplina é obrigatória.")).toBeInTheDocument();
    });
  });

  it("chama editTeacher e navega ao salvar com dados válidos", async () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      dateOfBirth: "1980-05-10",
      subject: "Matemática",
      phone: "123",
      address: "Rua A",
    });
    editTeacherMock.mockReturnValue(true);

    renderComponent("1");

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(editTeacherMock).toHaveBeenCalledWith(1, {
        name: "Professor X",
        email: "x@example.com",
        dateOfBirth: "1980-05-10",
        subject: "Matemática",
        phone: "123",
        address: "Rua A",
      });
      expect(window.alert).toHaveBeenCalledWith("Professor atualizado com sucesso!");
      expect(navigateMock).toHaveBeenCalledWith("/teachers");
    });
  });

  it("alerta se editTeacher retornar false", async () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      dateOfBirth: "1980-05-10",
      subject: "Matemática",
      phone: "123",
      address: "Rua A",
    });
    editTeacherMock.mockReturnValue(false);

    renderComponent("1");

    fireEvent.click(screen.getByText("Salvar"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erro ao atualizar professor");
    });
  });

  it("navega ao clicar em Voltar à Lista", async () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      dateOfBirth: "1980-05-10",
      subject: "Matemática",
      phone: "123",
      address: "Rua A",
    });

    renderComponent("1");
    fireEvent.click(screen.getByText("Voltar à Lista"));
    expect(navigateMock).toHaveBeenCalledWith("/teachers");
  });
});
