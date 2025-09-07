// src/mocks/teachers.test.ts
import { 
  getTeachers, 
  getTeacherById, 
  createTeacher, 
  updateTeacher, 
  deleteTeacher, 
  mockTeachers 
} from './Teachers';
import type { Teacher } from '../types/teacher';

describe('mockTeachers', () => {
  const initialData: Omit<Teacher, 'id'>[] = [
    {
      name: "João Silva",
      email: "joao.silva@email.com",
      dateOfBirth: "1980-05-12",
      subject: "Matemática",
      phone: "123456789",
      address: "Rua A, 123",
      photoUrl: "https://i.pravatar.cc/150?img=1"
    },
    {
      name: "Maria Souza",
      email: "maria.souza@email.com",
      dateOfBirth: "1975-10-30",
      subject: "História",
      phone: "987654321",
      address: "Av. B, 456",
      photoUrl: "https://i.pravatar.cc/150?img=2"
    }
  ];

  beforeEach(() => {
    // Limpar todos os dados
    mockTeachers.forEach(t => deleteTeacher(t.id));

    // Recriar dados iniciais
    initialData.forEach(d => createTeacher(d));
  });

  it('getTeachers deve retornar todos os professores', () => {
    const teachers = getTeachers();
    expect(teachers.length).toBe(2);
    expect(teachers[0].name).toBe('João Silva');
  });

  it('getTeachers deve retornar uma cópia do array (imutabilidade)', () => {
    const list1 = getTeachers();
    const list2 = getTeachers();
    expect(list1).not.toBe(list2);
    list1.pop();
    expect(list2.length).toBe(2);
  });

  it('getTeacherById deve retornar professor correto', () => {
    const teacher = getTeacherById(2);
    expect(teacher).toBeDefined();
    expect(teacher?.name).toBe('Maria Souza');
  });

  it('getTeacherById deve retornar undefined se não existir', () => {
    expect(getTeacherById(999)).toBeUndefined();
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

  it('createTeacher deve gerar IDs únicos mesmo após deletar', () => {
    const t1 = createTeacher({
      name: "Ana Lima",
      email: "ana@email.com",
      dateOfBirth: "1992-08-20",
      subject: "Química",
      phone: "444555666",
      address: "Rua D",
      photoUrl: "https://i.pravatar.cc/150?img=4"
    });
    deleteTeacher(t1.id);
    const t2 = createTeacher({
      name: "Paulo Costa",
      email: "paulo@email.com",
      dateOfBirth: "1985-11-11",
      subject: "Biologia",
      phone: "777888999",
      address: "Rua E",
      photoUrl: "https://i.pravatar.cc/150?img=5"
    });
    expect(t2.id).toBeGreaterThan(t1.id);
  });

  it('updateTeacher deve atualizar professor existente', () => {
    const updated = updateTeacher(1, { phone: '999888777' });
    expect(updated).toBeDefined();
    expect(updated?.phone).toBe('999888777');
    expect(getTeacherById(1)?.phone).toBe('999888777');
  });

  it('updateTeacher deve atualizar parcialmente os campos', () => {
    const updated = updateTeacher(1, { subject: 'Matemática Avançada' });
    expect(updated?.subject).toBe('Matemática Avançada');
    expect(updated?.phone).toBe('999888777'); // mantém valor anterior
  });

  it('updateTeacher deve retornar null se professor não existir', () => {
    expect(updateTeacher(999, { phone: '000' })).toBeNull();
  });

  it('deleteTeacher deve remover professor existente', () => {
    deleteTeacher(2);
    expect(getTeacherById(2)).toBeUndefined();
    expect(getTeachers().length).toBe(1);
  });

  it('deleteTeacher deve retornar false se professor não existir', () => {
    const initialLength = getTeachers().length;
    deleteTeacher(999);
    expect(getTeachers().length).toBe(initialLength);
  });
});
