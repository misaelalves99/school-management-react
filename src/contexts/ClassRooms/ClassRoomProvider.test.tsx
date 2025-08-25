// src/contexts/ClassRooms/ClassRoomProvider.test.tsx

import { ReactNode, useContext } from 'react';
import { renderHook, act } from '@testing-library/react';
import { ClassRoomProvider } from './ClassRoomProvider';
import { ClassRoomContext } from './ClassRoomContext';
import * as mocks from '../../mocks/ClassRooms';

describe('ClassRoomProvider', () => {
  const wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <ClassRoomProvider>{children}</ClassRoomProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve fornecer classRooms iniciais', () => {
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });
    expect(result.current.classRooms).toEqual(mocks.getClassRooms());
  });

  it('deve criar uma nova sala', () => {
    const newClassRoomData = {
      name: 'Nova Sala',
      capacity: 20,
      schedule: 'Qui - 14:00 às 16:00',
      subjects: [],
      teachers: [],
      classTeacher: undefined,
    };

    const spyCreate = jest.spyOn(mocks, 'createClassRoom');
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });

    act(() => {
      result.current.create(newClassRoomData);
    });

    expect(spyCreate).toHaveBeenCalledWith(newClassRoomData);
    expect(result.current.classRooms.some(cr => cr.name === 'Nova Sala')).toBe(true);
  });

  it('deve atualizar uma sala existente', () => {
    const spyUpdate = jest.spyOn(mocks, 'updateClassRoom');
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });
    const firstId = result.current.classRooms[0].id;

    act(() => {
      result.current.update(firstId, { name: 'Atualizada' });
    });

    expect(spyUpdate).toHaveBeenCalledWith(firstId, { name: 'Atualizada' });
    expect(result.current.getById(firstId)?.name).toBe('Atualizada');
  });

  it('deve remover uma sala', () => {
    const spyDelete = jest.spyOn(mocks, 'deleteClassRoom');
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });
    const firstId = result.current.classRooms[0].id;

    act(() => {
      result.current.remove(firstId);
    });

    expect(spyDelete).toHaveBeenCalledWith(firstId);
    expect(result.current.getById(firstId)).toBeUndefined();
  });

  it('deve buscar sala pelo id', () => {
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });
    const first = result.current.classRooms[0];

    act(() => {
      const found = result.current.getById(first.id);
      expect(found).toEqual(first);
    });
  });

  it('deve atualizar classRooms ao chamar refresh', () => {
    const spyGet = jest.spyOn(mocks, 'getClassRooms');
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });

    act(() => {
      result.current.refresh();
    });

    expect(spyGet).toHaveBeenCalled();
    expect(result.current.classRooms).toEqual(mocks.getClassRooms());
  });
});
