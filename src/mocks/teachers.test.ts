// src/mocks/teachers.test.ts

import { 
  getTeachers, 
  getTeacherById, 
  createTeacher, 
  updateTeacher, 
  deleteTeacher, 
  mockTeachers 
} from './Teachers';

describe('mockTeachers', () => {
  beforeEach(() => {
    // Resetar os dados originais
    while (mockTeachers.length > 0) {
      deleteTeacher(mockTeachers[mockTeachers.length - 1].id);
    }

    // Recriar dados iniciais
    createTeacher({
      name: "João Silva",
      email: "joao.silva@email.com",
      dateOfBirth: "1980-05-12",
      subject: "Matemática",
      phone: "123456789",
      address: "Rua A, 123",
      photoUrl: "https://i.pravatar.cc/150?img=1"
    });
    createTeacher({
      name: "Maria Souza",
      email: "maria.souza@email.com",
      dateOfBirth: "1975-10-30",
      subject: "História",
      phone: "987654321",
      address: "Av. B, 456",
      photoUrl: "https://i.pravatar.cc/150?img=2"
    });
  });

  it('getTeachers deve retornar todos os professores', () => {
    const teachers = getTeachers();
    expect(teachers.length).toBe(2);
    expect(teachers[0].name).toBe('João Silva');
  });

  it('getTeacherById deve retornar professor correto', () => {
    const teacher = getTeacherById(2);
    expect(teacher).toBeDefined();
    expect(teacher?.name).toBe('Maria Souza');
  });

  it('getTeacherById deve retornar undefined se não existir', () => {
    const teacher = getTeacherById(999);
    expect(teacher).toBeUndefined();
  });

  it('createTeacher deve adicionar um novo professor', () => {
    const newTeacher = createTeacher({
      name: "Carlos Pereira",
      email: "carlos@email.com",
      dateOfBirth: "1990-03-01",
      subject: "Física",
      phone: "111222333",
      address: "Rua C",
      photoUrl: "https://i.pravatar.cc/150?img=3"
    });
    expect(newTeacher.id).toBeGreaterThan(0);
    expect(getTeachers()).toContainEqual(newTeacher);
  });

  it('updateTeacher deve atualizar professor existente', () => {
    const updated = updateTeacher(1, { phone: '999888777' });
    expect(updated).toBeDefined();
    expect(updated?.phone).toBe('999888777');
    expect(getTeacherById(1)?.phone).toBe('999888777');
  });

  it('updateTeacher deve retornar null se professor não existir', () => {
    const updated = updateTeacher(999, { phone: '000' });
    expect(updated).toBeNull();
  });

  it('deleteTeacher deve remover professor existente', () => {
    deleteTeacher(2);
    expect(getTeacherById(2)).toBeUndefined();
    expect(getTeachers().length).toBe(1);
  });
});
