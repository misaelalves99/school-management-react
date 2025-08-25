// src/pages/ClassRooms/wrappers.test.tsx

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ClassRoomDeletePageWrapper, ClassRoomDetailsPageWrapper, ClassRoomEditPageWrapper } from './wrappers';

// Mock dos componentes usados pelos wrappers
jest.mock('./Delete/DeletePage', () => jest.fn(() => <div>DeleteClassRoomMock</div>));
jest.mock('./Details/DetailsPage', () => jest.fn(() => <div>DetailsClassRoomMock</div>));
jest.mock('./Edit/EditPage', () => jest.fn(() => <div>EditClassRoomMock</div>));

describe('ClassRoom Wrappers', () => {

  it('renderiza DeleteClassRoom com id', () => {
    render(
      <MemoryRouter initialEntries={['/classrooms/delete/5']}>
        <Routes>
          <Route path="/classrooms/delete/:id" element={<ClassRoomDeletePageWrapper />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('DeleteClassRoomMock')).toBeInTheDocument();
  });

  it('renderiza mensagem quando id ausente no Delete wrapper', () => {
    render(
      <MemoryRouter initialEntries={['/classrooms/delete']}>
        <Routes>
          <Route path="/classrooms/delete" element={<ClassRoomDeletePageWrapper />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
  });

  it('renderiza DetailsClassRoom com id', () => {
    render(
      <MemoryRouter initialEntries={['/classrooms/details/3']}>
        <Routes>
          <Route path="/classrooms/details/:id" element={<ClassRoomDetailsPageWrapper />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('DetailsClassRoomMock')).toBeInTheDocument();
  });

  it('renderiza mensagem quando id ausente no Details wrapper', () => {
    render(
      <MemoryRouter initialEntries={['/classrooms/details']}>
        <Routes>
          <Route path="/classrooms/details" element={<ClassRoomDetailsPageWrapper />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
  });

  it('renderiza EditClassRoom com id', () => {
    render(
      <MemoryRouter initialEntries={['/classrooms/edit/2']}>
        <Routes>
          <Route path="/classrooms/edit/:id" element={<ClassRoomEditPageWrapper />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('EditClassRoomMock')).toBeInTheDocument();
  });

  it('renderiza mensagem quando id ausente no Edit wrapper', () => {
    render(
      <MemoryRouter initialEntries={['/classrooms/edit']}>
        <Routes>
          <Route path="/classrooms/edit" element={<ClassRoomEditPageWrapper />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Turma não encontrada/i)).toBeInTheDocument();
  });

});
