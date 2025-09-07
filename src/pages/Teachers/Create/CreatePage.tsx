// src/pages/Teachers/Create/CreatePage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePage.module.css";
import type { TeacherFormData } from "../../../types/TeacherFormData";
import { useTeachers } from "../../../hooks/useTeachers";
import { useSubjects } from "../../../hooks/useSubjects";
import type { Subject } from "../../../types/Subject";

export default function TeacherCreatePage() {
  const navigate = useNavigate();
  const { addTeacher } = useTeachers();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    addTeacher(formData);
    alert("Professor cadastrado com sucesso!");
    navigate("/teachers");
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Cadastrar Novo Professor</h1>
      <form onSubmit={handleSubmit} className={styles.createForm}>
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
              className={styles.formInput}
              value={formData[name as keyof TeacherFormData]}
              onChange={handleChange}
            />
            {errors[name as keyof TeacherFormData] && (
              <span className={styles.formError}>{errors[name as keyof TeacherFormData]}</span>
            )}
          </div>
        ))}

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
            {subjects.map((subj: Subject) => (
              <option key={subj.id} value={subj.name}>
                {subj.name}
              </option>
            ))}
          </select>
          {errors.subject && <span className={styles.formError}>{errors.subject}</span>}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar</button>
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
