// src/pages/Students/Create/CreatePage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreatePage.module.css";
import type { Student } from "../../../types/Student";
import { useStudents } from "../../../hooks/useStudents";

export default function StudentCreatePage() {
  const navigate = useNavigate();
  const { addStudent } = useStudents();

  const [formData, setFormData] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    dateOfBirth: "",
    enrollmentNumber: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Student, "id">, string>>>({});

  const fieldLabels: Record<string, string> = {
    name: "Nome",
    email: "Email",
    dateOfBirth: "Data de Nascimento",
    enrollmentNumber: "Matrícula",
    phone: "Telefone",
    address: "Endereço",
  };

  const validate = () => {
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
    addStudent(formData);
    alert("Aluno cadastrado com sucesso!");
    navigate("/students");
  };

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Cadastrar Novo Aluno</h1>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key} className={styles.formLabel}>
              {fieldLabels[key] || key}:
            </label>
            <input
              id={key}
              name={key}
              type={key === "dateOfBirth" ? "date" : "text"}
              value={value}
              onChange={handleChange}
              className={styles.formInput}
            />
            {errors[key as keyof typeof formData] && (
              <span className={styles.formError}>
                {errors[key as keyof typeof formData]}
              </span>
            )}
          </div>
        ))}
        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar</button>
          <button type="button" className={styles.btnSecondary} onClick={() => navigate("/students")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
