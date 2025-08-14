// src/pages/Enrollments/Create/CreatePage.tsx

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePage.module.css';

import type { Student } from '../../../types/Student';
import type { ClassRoom } from '../../../types/ClassRoom';
import type { EnrollmentForm } from '../../../types/enrollmentForm';
import type { ValidationErrors } from '../../../types/validationErrors';

interface CreateEnrollmentPageProps {
  students: Student[];
  classRooms: ClassRoom[];
  onCreate: (newEnrollment: EnrollmentForm) => Promise<void>;
}

export default function CreateEnrollmentPage({
  students,
  classRooms,
  onCreate,
}: CreateEnrollmentPageProps) {
  const [form, setForm] = useState<EnrollmentForm>({
    studentId: '',
    classRoomId: '',
    enrollmentDate: new Date().toISOString().slice(0, 10),
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const navigate = useNavigate();

  function validate(): boolean {
    const newErrors: ValidationErrors = {};
    if (!form.studentId) newErrors.studentId = 'Aluno é obrigatório.';
    if (!form.classRoomId) newErrors.classRoomId = 'Turma é obrigatória.';
    if (!form.enrollmentDate) newErrors.enrollmentDate = 'Data da matrícula é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onCreate({
        studentId: Number(form.studentId),
        classRoomId: Number(form.classRoomId),
        enrollmentDate: form.enrollmentDate,
      });
      navigate('/enrollments');
    } catch (error) {
      console.error('Erro ao criar matrícula:', error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'studentId' || name === 'classRoomId' ? (value ? Number(value) : '') : value,
    }));
  }

  return (
    <>
      <h1 className={styles.title}>Nova Matrícula</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles['form-group']}>
          <label htmlFor="studentId">Aluno</label>
          <select
            id="studentId"
            name="studentId"
            value={form.studentId}
            onChange={handleChange}
            className={styles['form-control']}
          >
            <option value="">Selecione o Aluno</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.studentId && <span className={styles['text-danger']}>{errors.studentId}</span>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="classRoomId">Turma</label>
          <select
            id="classRoomId"
            name="classRoomId"
            value={form.classRoomId}
            onChange={handleChange}
            className={styles['form-control']}
          >
            <option value="">Selecione a Turma</option>
            {classRooms.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.classRoomId && <span className={styles['text-danger']}>{errors.classRoomId}</span>}
        </div>

        <div className={styles['form-group']}>
          <label htmlFor="enrollmentDate">Data da Matrícula</label>
          <input
            id="enrollmentDate"
            name="enrollmentDate"
            type="date"
            value={form.enrollmentDate}
            onChange={handleChange}
            className={styles['form-control']}
          />
          {errors.enrollmentDate && <span className={styles['text-danger']}>{errors.enrollmentDate}</span>}
        </div>

        <div className={styles['form-group']}>
          <button type="submit" className={styles['btn-submit']}>
            Salvar
          </button>
        </div>
      </form>

      <button
        className={styles['btn-secondary']}
        onClick={() => navigate('/enrollments')}
        type="button"
      >
        Voltar à Lista
      </button>
    </>
  );
}
