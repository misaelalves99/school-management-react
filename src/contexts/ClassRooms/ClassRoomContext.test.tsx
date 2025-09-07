// src/contexts/ClassRooms/ClassRoomContext.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useContext } from 'react';
import { ClassRoomContext, ClassRoomContextType } from './ClassRoomContext';
import type { ClassRoom } from '../../types/classroom.ts';

// Hook auxiliar que consome o contexto
const useClassRoomContext = () => {
  const context = useContext(ClassRoomContext);
  if (!context) throw new Error('useClassRoomContext must be used within a ClassRoomProvider');
  return context;
};

describe('ClassRoomContext', () => {
  let mockContext: jest.Mocked<ClassRoomContextType>;

  beforeEach(() => {
    mockContext = {
      classRooms: [],
      refresh: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getById: jest.fn(),
    };
  });

  it('deve criar o contexto com os métodos corretos', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ClassRoomContext.Provider value={mockContext}>{children}</ClassRoomContext.Provider>
    );

    const { result } = renderHook(() => useClassRoomContext(), { wrapper });

    expect(result.current).toHaveProperty('classRooms');
    expect(result.current).toHaveProperty('refresh');
    expect(result.current).toHaveProperty('create');
    expect(result.current).toHaveProperty('update');
    expect(result.current).toHaveProperty('remove');
    expect(result.current).toHaveProperty('getById');
  });

  it('deve lançar erro se usado fora do provider', () => {
    expect(() => renderHook(() => useClassRoomContext())).toThrow(
      'useClassRoomContext must be used within a ClassRoomProvider'
    );
  });

  it('deve chamar os métodos do contexto corretamente', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ClassRoomContext.Provider value={mockContext}>{children}</ClassRoomContext.Provider>
    );

    const { result } = renderHook(() => useClassRoomContext(), { wrapper });

    const newClassRoom: Omit<ClassRoom, 'id'> = {
      name: 'Sala 101',
      capacity: 30,
      schedule: 'Manhã',
      subjects: [],
      teachers: [],
    };

    act(() => {
      result.current.refresh();
      result.current.create(newClassRoom);
      result.current.update(1, { capacity: 40 });
      result.current.remove(1);
      result.current.getById(1);
    });

    expect(mockContext.refresh).toHaveBeenCalled();
    expect(mockContext.create).toHaveBeenCalledWith(newClassRoom);
    expect(mockContext.update).toHaveBeenCalledWith(1, { capacity: 40 });
    expect(mockContext.remove).toHaveBeenCalledWith(1);
    expect(mockContext.getById).toHaveBeenCalledWith(1);
  });
});
