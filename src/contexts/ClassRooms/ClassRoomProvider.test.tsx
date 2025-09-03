// src/contexts/ClassRooms/ClassRoomProvider.test.tsx

import { ReactNode, useContext } from 'react';
import { renderHook, act } from '@testing-library/react';
import { ClassRoomProvider } from './ClassRoomProvider';
import { ClassRoomContext } from './ClassRoomContext';
import * as mocks from '../../mocks/ClassRooms';
import type { ClassRoom } from '../../types/ClassRoom';

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

  it('deve criar uma nova sala e retorná-la', () => {
    const newClassRoomData: Omit<ClassRoom, 'id'> = {
      name: 'Nova Sala',
      capacity: 20,
      schedule: 'Qui - 14:00 às 16:00',
      subjects: [],
      teachers: [],
      classTeacher: undefined,
    };

    const spyCreate = jest.spyOn(mocks, 'createClassRoom');
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });

    let created: ClassRoom | null = null; // ✅ inicializado
    act(() => {
      created = result.current.create(newClassRoomData);
    });

    expect(spyCreate).toHaveBeenCalledWith(newClassRoomData);
    expect(created).not.toBeNull();
    expect(created!).toHaveProperty('id');
    expect(created!.name).toBe('Nova Sala');
    expect(result.current.classRooms.some(cr => cr.id === created!.id)).toBe(true);
  });

  it('deve atualizar uma sala existente e retorná-la', () => {
    const spyUpdate = jest.spyOn(mocks, 'updateClassRoom');
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });
    const firstId = result.current.classRooms[0].id;

    let updated: ClassRoom | null = null; // ✅ inicializado
    act(() => {
      updated = result.current.update(firstId, { name: 'Atualizada' });
    });

    expect(spyUpdate).toHaveBeenCalledWith(firstId, { name: 'Atualizada' });
    expect(updated).not.toBeNull();
    expect(result.current.getById(firstId)?.name).toBe('Atualizada');
  });

  it('deve retornar null ao tentar atualizar sala inexistente', () => {
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });

    let updated: ClassRoom | null = null; // ✅ inicializado
    act(() => {
      updated = result.current.update(9999, { name: 'Inexistente' });
    });

    expect(updated).toBeNull();
  });

  it('deve remover uma sala existente', () => {
    const spyDelete = jest.spyOn(mocks, 'deleteClassRoom');
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });
    const firstId = result.current.classRooms[0].id;

    act(() => {
      result.current.remove(firstId);
    });

    expect(spyDelete).toHaveBeenCalledWith(firstId);
    expect(result.current.getById(firstId)).toBeUndefined();
  });

  it('getById deve retornar undefined para sala inexistente', () => {
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });

    const notFound = result.current.getById(9999);
    expect(notFound).toBeUndefined();
  });

  it('deve buscar sala pelo id existente', () => {
    const { result } = renderHook(() => useContext(ClassRoomContext)!, { wrapper });
    const first = result.current.classRooms[0];

    let found: ClassRoom | undefined = undefined; // ✅ inicializado
    act(() => {
      found = result.current.getById(first.id);
    });

    expect(found).toEqual(first);
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

  it('deve renderizar os children dentro do provider', () => {
    const { result } = renderHook(() => useContext(ClassRoomContext), { wrapper });
    expect(result.current).toBeDefined();
  });
});
