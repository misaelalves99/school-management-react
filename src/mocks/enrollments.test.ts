// src/mocks/enrollments.test.ts
import {
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "./Enrollments";
import type { Enrollment } from "../types/enrollment";

describe("Enrollments mocks", () => {
  const initialData: Omit<Enrollment, "id">[] = [
    { studentId: 1, classRoomId: 1, enrollmentDate: "2025-01-10", status: "Ativo" },
    { studentId: 2, classRoomId: 2, enrollmentDate: "2025-01-15", status: "Inativo" },
    { studentId: 1, classRoomId: 2, enrollmentDate: "2025-02-01", status: "Ativo" },
  ];

  beforeEach(() => {
    // Limpar todos os dados atuais
    getEnrollments().forEach(e => deleteEnrollment(e.id));

    // Reinserir dados iniciais
    initialData.forEach(e => createEnrollment(e));
  });

  it("getEnrollments deve retornar todas as matrículas", () => {
    const enrollments = getEnrollments();
    expect(enrollments.length).toBe(3);
    expect(enrollments[0].studentId).toBe(1);
  });

  it("getEnrollmentById deve retornar a matrícula correta", () => {
    const enrollment = getEnrollmentById(2);
    expect(enrollment).toBeDefined();
    expect(enrollment?.status).toBe("Inativo");
  });

  it("getEnrollmentById deve retornar undefined se não existir", () => {
    expect(getEnrollmentById(999)).toBeUndefined();
  });

  it("createEnrollment deve adicionar uma nova matrícula", () => {
    const newEnrollment = createEnrollment({
      studentId: 3,
      classRoomId: 1,
      enrollmentDate: "2025-03-01",
      status: "Ativo",
    });
    expect(newEnrollment.id).toBeGreaterThan(0);
    expect(getEnrollments()).toContainEqual(newEnrollment);
  });

  it("createEnrollment deve gerar IDs únicos mesmo após deletar", () => {
    const e1 = createEnrollment({ studentId: 4, classRoomId: 1, enrollmentDate: "2025-04-01", status: "Ativo" });
    deleteEnrollment(e1.id);
    const e2 = createEnrollment({ studentId: 5, classRoomId: 2, enrollmentDate: "2025-04-02", status: "Ativo" });
    expect(e2.id).toBeGreaterThan(e1.id);
  });

  it("updateEnrollment deve atualizar uma matrícula existente", () => {
    const updated = updateEnrollment(1, { status: "Inativo" });
    expect(updated).toBeDefined();
    expect(updated?.status).toBe("Inativo");
    expect(getEnrollmentById(1)?.status).toBe("Inativo");
  });

  it("updateEnrollment deve atualizar parcialmente os dados", () => {
    const updated = updateEnrollment(1, { enrollmentDate: "2025-05-01" });
    expect(updated?.enrollmentDate).toBe("2025-05-01");
    expect(getEnrollmentById(1)?.status).toBe("Ativo"); // status permanece
  });

  it("updateEnrollment deve retornar null se a matrícula não existir", () => {
    expect(updateEnrollment(999, { status: "Ativo" })).toBeNull();
  });

  it("deleteEnrollment deve remover a matrícula correta", () => {
    deleteEnrollment(2);
    expect(getEnrollmentById(2)).toBeUndefined();
    expect(getEnrollments().length).toBe(2);
  });

  it("deleteEnrollment em matrícula inexistente não deve lançar erro", () => {
    expect(() => deleteEnrollment(999)).not.toThrow();
  });

  it("getEnrollments deve retornar uma cópia do array (imutabilidade)", () => {
    const list1 = getEnrollments();
    const list2 = getEnrollments();
    expect(list1).not.toBe(list2); // arrays diferentes
    list1.pop();
    expect(list2.length).toBe(3); // array original não é alterado
  });
});
