import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePage.module.css';
import { useStudents } from '../../../hooks/useStudents';
import { useClassRooms } from '../../../hooks/useClassRooms';
import { useEnrollments } from '../../../hooks/useEnrollments';
import type { EnrollmentFormData } from '../../../types/enrollment-form';
import type { ClassRoom } from '../../../types/classroom.ts';

type EnrollmentErrors = {
  [K in keyof EnrollmentFormData]?: string;
};

export default function CreateEnrollmentPage() {
  const navigate = useNavigate();
  const { students = [] } = useStudents();
  const { classRooms = [] } = useClassRooms();
  const { createEnrollment } = useEnrollments();

  const [form, setForm] = useState<EnrollmentFormData>({
    studentId: 0,
    classRoomId: 0,
    enrollmentDate: new Date().toISOString().slice(0, 10),
    status: 'Ativa',
  });

  const [errors, setErrors] = useState<EnrollmentErrors>({});

  const toNumber = (value: string) => {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      studentId: name === 'studentId' ? toNumber(value) : prev.studentId,
      classRoomId: name === 'classRoomId' ? toNumber(value) : prev.classRoomId,
      enrollmentDate: name === 'enrollmentDate' ? value : prev.enrollmentDate,
      status: prev.status,
    }));
  };

  const validate = () => {
    const newErrors: EnrollmentErrors = {};
    if (!form.studentId) newErrors.studentId = 'Aluno é obrigatório.';
    if (!form.classRoomId) newErrors.classRoomId = 'Turma é obrigatória.';
    if (!form.enrollmentDate) newErrors.enrollmentDate = 'Data da matrícula é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createEnrollment(form);
      alert('Matrícula criada com sucesso!');
      navigate('/enrollments');
    } catch (error) {
      console.error('Erro ao criar matrícula:', error);
      alert('Ocorreu um erro ao criar a matrícula.');
    }
  };

  if (!students.length || !classRooms.length) return <p>Carregando...</p>;

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Nova Matrícula</h1>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        <div className={styles.formGroup}>
          <label htmlFor="studentId" className={styles.formLabel}>Aluno</label>
          <select
            id="studentId"
            name="studentId"
            value={form.studentId === 0 ? '' : form.studentId}
            onChange={handleChange}
            className={styles.formInput}
          >
            <option value="">Selecione o Aluno</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {errors.studentId && <span className={styles.formError}>{errors.studentId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="classRoomId" className={styles.formLabel}>Turma</label>
          <select
            id="classRoomId"
            name="classRoomId"
            value={form.classRoomId === 0 ? '' : form.classRoomId}
            onChange={handleChange}
            className={styles.formInput}
          >
            <option value="">Selecione a Turma</option>
            {classRooms.map((c: ClassRoom) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.classRoomId && <span className={styles.formError}>{errors.classRoomId}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="enrollmentDate" className={styles.formLabel}>Data da Matrícula</label>
          <input
            id="enrollmentDate"
            name="enrollmentDate"
            type="date"
            value={form.enrollmentDate}
            onChange={handleChange}
            className={styles.formInput}
          />
          {errors.enrollmentDate && <span className={styles.formError}>{errors.enrollmentDate}</span>}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar</button>
          <button type="button" className={styles.btnSecondary} onClick={() => navigate('/enrollments')}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
