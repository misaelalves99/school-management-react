// src/pages/ClassRooms/Delete/DeletePage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import DeleteClassRoom from './DeletePage';
import { useClassRooms } from '../../../hooks/useClassRooms';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../../../hooks/useClassRooms');

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('DeleteClassRoom', () => {
  const removeMock = jest.fn();
  const getByIdMock = jest.fn();

  beforeEach(() => {
    (useClassRooms as jest.Mock).mockReturnValue({
      getById: getByIdMock,
      remove: removeMock,
    });
    mockedNavigate.mockClear();
    removeMock.mockClear();
    getByIdMock.mockClear();
    window.alert = jest.fn();
  });

  const renderComponent = (id?: string) => {
    render(
      <MemoryRouter initialEntries={[id ? `/classrooms/delete/${id}` : '/classrooms/delete']}>
        <Routes>
          <Route path="/classrooms/delete/:id" element={<DeleteClassRoom />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('exibe mensagem de não encontrado se turma não existir', () => {
    getByIdMock.mockReturnValue(undefined);
    renderComponent('999');
    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
  });

  it('renderiza detalhes da turma corretamente', () => {
    getByIdMock.mockReturnValue({
      id: 1,
      name: 'Sala Teste',
      capacity: 20,
      schedule: 'Seg - 08:00 às 10:00',
      subjects: [{ id: 1, name: 'Matemática', description: '', workloadHours: 40 }],
      teachers: [{ id: 1, name: 'Prof. A', email: '', dateOfBirth: '', subject: '', phone: '', address: '' }],
      classTeacher: undefined,
    });

    renderComponent('1');

    expect(screen.getByText(/Sala Teste/i)).toBeInTheDocument();
    expect(screen.getByText(/Seg - 08:00 às 10:00/i)).toBeInTheDocument();
    expect(screen.getByText(/Matemática/i)).toBeInTheDocument();
    expect(screen.getByText(/Prof. A/i)).toBeInTheDocument();
  });

  it('exclui a turma ao clicar em Excluir', () => {
    getByIdMock.mockReturnValue({ id: 1, name: 'Sala Teste', capacity: 20, schedule: 'Horário', subjects: [], teachers: [], classTeacher: undefined });

    renderComponent('1');

    fireEvent.click(screen.getByText(/Excluir/i));

    expect(removeMock).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith('Turma excluída com sucesso!');
    expect(mockedNavigate).toHaveBeenCalledWith('/classrooms');
  });

  it('botão Cancelar navega para lista', () => {
    getByIdMock.mockReturnValue({ id: 1, name: 'Sala Teste', capacity: 20, schedule: 'Horário', subjects: [], teachers: [], classTeacher: undefined });

    renderComponent('1');

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/classrooms');
  });
});
