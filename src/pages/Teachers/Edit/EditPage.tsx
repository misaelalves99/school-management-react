// src/pages/Teachers/Edit/EditPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditPage.module.css";
import { useTeachers } from "../../../hooks/useTeachers";
import { useSubjects } from "../../../hooks/useSubjects";
import type { TeacherFormData } from "../../../types/TeacherFormData";

export default function TeacherEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTeacher, editTeacher } = useTeachers();
  const { subjects } = useSubjects();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
    if (!validate() || !id) return;

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
        {/* Campos de input comuns */}
        {[
          { label: "Nome", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Data de Nascimento", name: "dateOfBirth", type: "date" },
          { label: "Telefone", name: "phone", type: "tel" },
          { label: "Endereço", name: "address", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name} className={styles.formGroup}>
            <label htmlFor={name} className={styles.formLabel}>{label}</label>
            <input
              id={name}
              name={name}
              type={type}
              value={formData[name as keyof TeacherFormData]}
              onChange={handleChange}
              className={styles.formInput}
            />
            {errors[name as keyof TeacherFormData] && (
              <span className={styles.formError}>{errors[name as keyof TeacherFormData]}</span>
            )}
          </div>
        ))}

        {/* Select de disciplinas usando useSubjects */}
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.formLabel}>Disciplina</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={styles.formInput}
          >
            <option value="">Selecione uma disciplina</option>
            {subjects.map(subj => (
              <option key={subj.id} value={subj.name}>
                {subj.name}
              </option>
            ))}
          </select>
          {errors.subject && <span className={styles.formError}>{errors.subject}</span>}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar Alterações</button>
          <button type="button" className={styles.btnSecondary} onClick={() => navigate("/teachers")}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
