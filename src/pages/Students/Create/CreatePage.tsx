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

  const [errors, setErrors] = useState<
    Partial<Record<keyof Omit<Student, "id">, string>>
  >({});

  const fieldLabels: Record<keyof typeof formData, string> = {
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
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido.";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Data de nascimento é obrigatória.";
    if (!formData.enrollmentNumber.trim())
      newErrors.enrollmentNumber = "Matrícula é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        {(
          Object.keys(formData) as Array<keyof typeof formData>
        ).map(key => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key} className={styles.formLabel}>
              {fieldLabels[key]}:
            </label>
            <input
              id={key}
              name={key}
              type={key === "dateOfBirth" ? "date" : "text"}
              value={formData[key]}
              onChange={handleChange}
              className={styles.formInput}
            />
            {errors[key] && (
              <span className={styles.formError}>{errors[key]}</span>
            )}
          </div>
        ))}
        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>
            Salvar
          </button>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => navigate("/students")}
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
