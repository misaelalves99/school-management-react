// src/pages/Students/Create/CreatePage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePage.module.css";
import type { Student } from "../../../types/Student";

interface Props {
  onAddStudent: (newStudent: Omit<Student, "id">) => void;
}

export default function StudentCreatePage({ onAddStudent }: Props) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    dateOfBirth: "",
    enrollmentNumber: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Student, "id">, string>>>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido.";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Data de nascimento é obrigatória.";
    if (!formData.enrollmentNumber.trim()) newErrors.enrollmentNumber = "Matrícula é obrigatória.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Usando o callback do App.tsx
    onAddStudent(formData);

    alert("Aluno cadastrado com sucesso!");
    navigate("/students");
  };

  return (
    <div className={styles.container}>
      <h1>Cadastrar Novo Aluno</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              id={key}
              name={key}
              type={key === "dateOfBirth" ? "date" : "text"}
              value={value}
              onChange={handleChange}
            />
            {errors[key as keyof typeof formData] && (
              <span className={styles.error}>{errors[key as keyof typeof formData]}</span>
            )}
          </div>
        ))}
        <div className={styles.actions}>
          <button type="submit" className={styles.btnPrimary}>Salvar</button>
          <button type="button" className={styles.btnSecondary} onClick={() => navigate("/students")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
