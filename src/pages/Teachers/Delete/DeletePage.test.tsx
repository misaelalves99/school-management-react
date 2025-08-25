// src/pages/Teachers/Delete/DeletePage.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TeacherDelete from "./DeletePage";
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

describe("TeacherDelete", () => {
  const removeTeacherMock = jest.fn();
  const getTeacherMock = jest.fn();
  const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

  beforeEach(() => {
    jest.clearAllMocks();
    (useTeachers as jest.Mock).mockReturnValue({
      getTeacher: getTeacherMock,
      removeTeacher: removeTeacherMock,
    });
  });

  const renderComponent = (id?: string) =>
    render(
      <MemoryRouter initialEntries={[id ? `/teachers/delete/${id}` : "/teachers/delete"]}>
        <Routes>
          <Route path="/teachers/delete/:id" element={<TeacherDelete />} />
        </Routes>
      </MemoryRouter>
    );

  it("exibe mensagem de ID inválido quando não há ID", () => {
    renderComponent();
    expect(screen.getByText("Id inválido")).toBeInTheDocument();
  });

  it("exibe mensagem de professor não encontrado quando getTeacher retorna undefined", () => {
    getTeacherMock.mockReturnValue(undefined);
    renderComponent("1");
    expect(screen.getByText("Professor não encontrado.")).toBeInTheDocument();
  });

  it("renderiza informações do professor e botões", () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      phone: "123456789",
    });
    renderComponent("1");

    expect(screen.getByText("Excluir Professor")).toBeInTheDocument();
    expect(screen.getByText("Tem certeza que deseja excluir este professor?")).toBeInTheDocument();
    expect(screen.getByText("Professor X")).toBeInTheDocument();
    expect(screen.getByText("E-mail: x@example.com")).toBeInTheDocument();
    expect(screen.getByText("Telefone: 123456789")).toBeInTheDocument();
    expect(screen.getByText("Excluir")).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("chama removeTeacher, alert e navigate ao confirmar exclusão", () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      phone: "123456789",
    });

    // Mock confirm para simular confirmação do usuário
    window.confirm = jest.fn(() => true);

    renderComponent("1");

    fireEvent.click(screen.getByText("Excluir"));

    expect(removeTeacherMock).toHaveBeenCalledWith(1);
    expect(alertMock).toHaveBeenCalledWith("Professor excluído com sucesso.");
    expect(navigateMock).toHaveBeenCalledWith("/teachers");
  });

  it("não exclui se usuário cancelar confirmação", () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      phone: "123456789",
    });

    window.confirm = jest.fn(() => false);

    renderComponent("1");

    fireEvent.click(screen.getByText("Excluir"));

    expect(removeTeacherMock).not.toHaveBeenCalled();
    expect(alertMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("botão cancelar navega para /teachers", () => {
    getTeacherMock.mockReturnValue({
      id: 1,
      name: "Professor X",
      email: "x@example.com",
      phone: "123456789",
    });

    renderComponent("1");

    fireEvent.click(screen.getByText("Cancelar"));
    expect(navigateMock).toHaveBeenCalledWith("/teachers");
  });
});
