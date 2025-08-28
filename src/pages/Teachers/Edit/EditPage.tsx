// src/pages/Teachers/Edit/EditPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditPage.module.css";
import { useTeachers } from "../../../hooks/useTeachers";
import type { TeacherFormData } from "../../../types/TeacherFormData";

export default function TeacherEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTeacher, editTeacher } = useTeachers();

  const [formData, setFormData] = useState<TeacherFormData>({
    name: "",
    email: "",
    dateOfBirth: "",
    subject: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TeacherFormData, string>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const teacher = getTeacher(Number(id));
    if (!teacher) {
      alert("Professor não encontrado");
      navigate("/teachers");
      return;
    }
    setFormData({
      name: teacher.name,
      email: teacher.email,
      dateOfBirth: teacher.dateOfBirth,
      subject: teacher.subject,
      phone: teacher.phone,
      address: teacher.address,
    });
    setLoading(false);
  }, [id, navigate, getTeacher]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof TeacherFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido.";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Data de nascimento é obrigatória.";
    if (!formData.subject.trim()) newErrors.subject = "Disciplina é obrigatória.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!id) return;

    const updated = editTeacher(Number(id), formData);
    if (!updated) {
      alert("Erro ao atualizar professor");
      return;
    }

    alert("Professor atualizado com sucesso!");
    navigate("/teachers");
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Editar Professor</h1>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key} className={styles.formLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              id={key}
              name={key}
              type={key === "dateOfBirth" ? "date" : key === "email" ? "email" : "text"}
              value={value}
              onChange={handleChange}
              className={styles.formInput}
            />
            {errors[key as keyof TeacherFormData] && (
              <span className={styles.formError}>{errors[key as keyof TeacherFormData]}</span>
            )}
          </div>
        ))}
        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar Alterações</button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => navigate("/teachers")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
