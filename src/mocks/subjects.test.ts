// src/mocks/subjects.test.ts
import { mockSubjects } from './Subjects';
import type { Subject } from '../types/Subject';

describe('mockSubjects', () => {
  const initialData: Omit<Subject, 'id'>[] = [
    { name: "Matemática", description: "Disciplina de matemática básica", workloadHours: 60 },
    { name: "Física", description: "Fundamentos de física moderna", workloadHours: 60 },
    { name: "Química", description: "Introdução à química orgânica", workloadHours: 60 },
    { name: "Biologia", description: "Biologia celular e molecular", workloadHours: 60 },
  ];

  beforeEach(() => {
    // Limpar todos os dados
    mockSubjects.list().forEach(s => mockSubjects.delete(s.id));

    // Recriar dados iniciais
    initialData.forEach(d => mockSubjects.create(d));
  });

  it('list deve retornar todas as disciplinas', () => {
    const subjects = mockSubjects.list();
    expect(subjects.length).toBe(4);
    expect(subjects[0].name).toBe('Matemática');
  });

  it('list deve retornar uma cópia do array (imutabilidade)', () => {
    const list1 = mockSubjects.list();
    const list2 = mockSubjects.list();
    expect(list1).not.toBe(list2);
    list1.pop();
    expect(list2.length).toBe(4);
  });

  it('get deve retornar disciplina pelo id', () => {
    const subject = mockSubjects.get(2);
    expect(subject).toBeDefined();
    expect(subject?.name).toBe('Física');
  });

  it('get deve retornar undefined se não existir', () => {
    expect(mockSubjects.get(999)).toBeUndefined();
  });

  it('create deve adicionar uma nova disciplina', () => {
    const newSubject = mockSubjects.create({ name: 'História', description: 'História do Brasil', workloadHours: 50 });
    expect(newSubject.id).toBeGreaterThan(0);
    expect(mockSubjects.list()).toContainEqual(newSubject);
  });

  it('create deve gerar IDs únicos mesmo após deletar', () => {
    const s1 = mockSubjects.create({ name: 'Geografia', description: 'Geografia mundial', workloadHours: 40 });
    mockSubjects.delete(s1.id);
    const s2 = mockSubjects.create({ name: 'Artes', description: 'Artes visuais', workloadHours: 30 });
    expect(s2.id).toBeGreaterThan(s1.id);
  });

  it('update deve atualizar disciplina existente', () => {
    const updated = mockSubjects.update(1, { workloadHours: 100 });
    expect(updated).toBeDefined();
    expect(updated?.workloadHours).toBe(100);
    expect(mockSubjects.get(1)?.workloadHours).toBe(100);
  });

  it('update deve atualizar parcialmente os campos', () => {
    const updated = mockSubjects.update(1, { name: 'Matemática Avançada' });
    expect(updated?.name).toBe('Matemática Avançada');
    expect(updated?.workloadHours).toBe(100); // mantém valor anterior
  });

  it('update deve retornar undefined se disciplina não existir', () => {
    expect(mockSubjects.update(999, { workloadHours: 100 })).toBeUndefined();
  });

  it('delete deve remover disciplina existente', () => {
    const result = mockSubjects.delete(3);
    expect(result).toBe(true);
    expect(mockSubjects.get(3)).toBeUndefined();
    expect(mockSubjects.list().length).toBe(3);
  });

  it('delete deve retornar false se disciplina não existir', () => {
    expect(mockSubjects.delete(999)).toBe(false);
  });
});
