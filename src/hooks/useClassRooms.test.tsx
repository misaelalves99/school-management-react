// src/hooks/useClassRooms.test.tsx
import { renderHook } from "@testing-library/react";
import { useClassRooms } from "./useClassRooms";
import { ClassRoomProvider } from "../contexts/ClassRooms/ClassRoomProvider";

describe("useClassRooms", () => {
  it("deve lançar erro se não estiver dentro do provider", () => {
    expect(() => renderHook(() => useClassRooms())).toThrowError(
      "useClassRooms deve ser usado dentro de um ClassRoomsProvider"
    );
  });

  it("deve retornar o contexto quando usado dentro do provider", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <ClassRoomProvider>{children}</ClassRoomProvider>
    );

    const { result } = renderHook(() => useClassRooms(), { wrapper });

    // Verifica se os métodos e estados do contexto estão definidos
    expect(result.current.classRooms).toBeDefined();
    expect(Array.isArray(result.current.classRooms)).toBe(true);
    expect(typeof result.current.refresh).toBe("function");
    expect(typeof result.current.create).toBe("function");
    expect(typeof result.current.update).toBe("function");
    expect(typeof result.current.remove).toBe("function");
    expect(typeof result.current.getById).toBe("function");
  });
});
