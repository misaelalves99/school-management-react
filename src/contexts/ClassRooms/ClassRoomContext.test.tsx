// src/contexts/ClassRooms/ClassRoomContext.test.tsx
import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { ClassRoomContext, ClassRoomContextType } from './ClassRoomContext';

// Hook de teste que consome o contexto
const useClassRoomContext = () => {
  const context = useContext(ClassRoomContext);
  if (!context) throw new Error('useClassRoomContext must be used within a ClassRoomProvider');
  return context;
};

describe('ClassRoomContext', () => {
  it('deve criar o contexto com os métodos corretos', () => {
    const mockContext: ClassRoomContextType = {
      classRooms: [],
      refresh: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getById: jest.fn(),
    };

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
});
