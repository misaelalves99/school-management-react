// src/pages/Enrollments/Edit/EditPage.tsx

import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EditPage.module.css";
import type { EnrollmentEdit } from "../../../types/EnrollmentEdit";
import type { ValidationErrors } from "../../../types/ValidationErrors";
import { useStudents } from "../../../hooks/useStudents";
import { useClassRooms } from "../../../hooks/useClassRooms";

interface EditProps {
  enrollment: EnrollmentEdit;
  onSave: (data: EnrollmentEdit) => Promise<void>;
}

export default function EditEnrollment({ enrollment, onSave }: EditProps) {
  const navigate = useNavigate();
  const { students = [] } = useStudents();
  const { classRooms = [] } = useClassRooms();

  const [formData, setFormData] = useState<EnrollmentEdit>({ ...enrollment });
  const [errors, setErrors] = useState<ValidationErrors<EnrollmentEdit>>({});

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        name === "studentId" || name === "classRoomId" ? Number(value) : value,
    }));
  }

  function validate(): boolean {
    const newErrors: ValidationErrors<EnrollmentEdit> = {};
    if (!formData.studentId) newErrors.studentId = "Aluno é obrigatório.";
    if (!formData.classRoomId) newErrors.classRoomId = "Turma é obrigatória.";
    if (!formData.enrollmentDate)
      newErrors.enrollmentDate = "Data da matrícula é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData);
    alert("Matrícula atualizada com sucesso!");
    navigate("/enrollments");
  }

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Editar Matrícula</h1>

      <form onSubmit={handleSubmit} className={styles.createForm}>
        <input type="hidden" name="id" value={formData.id} />

        {/* Aluno */}
        <div className={styles.formGroup}>
          <label htmlFor="studentId" className={styles.formLabel}>Aluno:</label>
          <select
            id="studentId"
            name="studentId"
            value={formData.studentId === 0 ? "" : formData.studentId}
            onChange={handleChange}
            className={styles.formInput}
          >
            <option value="">Selecione o Aluno</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {errors.studentId && <span className={styles.formError}>{errors.studentId}</span>}
        </div>

        {/* Turma */}
        <div className={styles.formGroup}>
          <label htmlFor="classRoomId" className={styles.formLabel}>Turma:</label>
          <select
            id="classRoomId"
            name="classRoomId"
            value={formData.classRoomId === 0 ? "" : formData.classRoomId}
            onChange={handleChange}
            className={styles.formInput}
          >
            <option value="">Selecione a Turma</option>
            {classRooms.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.classRoomId && <span className={styles.formError}>{errors.classRoomId}</span>}
        </div>

        {/* Data da matrícula */}
        <div className={styles.formGroup}>
          <label htmlFor="enrollmentDate" className={styles.formLabel}>Data da Matrícula:</label>
          <input
            id="enrollmentDate"
            name="enrollmentDate"
            type="date"
            value={formData.enrollmentDate}
            onChange={handleChange}
            className={styles.formInput}
          />
          {errors.enrollmentDate && (
            <span className={styles.formError}>{errors.enrollmentDate}</span>
          )}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar Alterações</button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => navigate("/enrollments")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
