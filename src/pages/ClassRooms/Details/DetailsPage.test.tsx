// src/pages/ClassRooms/Details/DetailsPage.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClassRoomDetailsPage from './DetailsPage';
import { useClassRooms } from '../../../hooks/useClassRooms';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

jest.mock('../../../hooks/useClassRooms');

describe('ClassRoomDetailsPage', () => {
  const getByIdMock = jest.fn();

  beforeEach(() => {
    (useClassRooms as jest.Mock).mockReturnValue({ getById: getByIdMock });
    getByIdMock.mockClear();
    mockedNavigate.mockClear();
  });

  it('exibe mensagem se turma não for encontrada', () => {
    getByIdMock.mockReturnValue(undefined);

    render(
      <BrowserRouter>
        <ClassRoomDetailsPage id={999} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
  });

  it('renderiza detalhes da turma com disciplinas e professores', () => {
    getByIdMock.mockReturnValue({
      id: 1,
      name: 'Sala Teste',
      capacity: 30,
      schedule: 'Seg - 08:00 às 10:00',
      subjects: [{ id: 1, name: 'Matemática', description: '', workloadHours: 40 }],
      teachers: [{ id: 1, name: 'Prof. A', email: '', dateOfBirth: '', subject: '', phone: '', address: '' }],
      classTeacher: { id: 1, name: 'Prof. A', email: '', dateOfBirth: '', subject: '', phone: '', address: '' },
    });

    render(
      <BrowserRouter>
        <ClassRoomDetailsPage id={1} />
      </BrowserRouter>
    );

    expect(screen.getByText('Sala Teste')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('Seg - 08:00 às 10:00')).toBeInTheDocument();

    expect(screen.getByText('Matemática')).toBeInTheDocument();
    expect(screen.getByText('Prof. A')).toBeInTheDocument();

    expect(screen.getByText('Prof. A')).toBeInTheDocument();

    // Testar navegação nos botões
    fireEvent.click(screen.getByText(/Editar/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/classrooms/edit/1');

    fireEvent.click(screen.getByText(/Voltar/i));
    expect(mockedNavigate).toHaveBeenCalledWith('/classrooms');
  });

  it('exibe mensagens padrão se não houver disciplinas ou professores', () => {
    getByIdMock.mockReturnValue({
      id: 2,
      name: 'Sala Vazia',
      capacity: 20,
      schedule: 'Ter - 10:00 às 12:00',
      subjects: [],
      teachers: [],
      classTeacher: undefined,
    });

    render(
      <BrowserRouter>
        <ClassRoomDetailsPage id={2} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Sem disciplinas vinculadas/i)).toBeInTheDocument();
    expect(screen.getByText(/Sem professores vinculados/i)).toBeInTheDocument();
    expect(screen.getByText(/Não definido/i)).toBeInTheDocument();
  });
});
