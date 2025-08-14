// src/pages/Students/Edit/EditPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditPage.module.css";
import { getStudentById, updateStudent } from "../../../mocks/students";
import type { Student } from "../../../types/Student";

export default function StudentEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    dateOfBirth: "",
    enrollmentNumber: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>({});

  useEffect(() => {
    if (!id) return;
    const student = getStudentById(Number(id));
    if (!student) {
      alert("Aluno não encontrado");
      navigate("/students");
      return;
    }
    // Copia todos os campos exceto o id
    const rest: Omit<Student, "id"> = {
      name: student.name,
      email: student.email,
      dateOfBirth: student.dateOfBirth,
      enrollmentNumber: student.enrollmentNumber,
      phone: student.phone,
      address: student.address,
    };
    setFormData(rest);
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name) newErrors.name = "Nome é obrigatório.";
    if (!formData.email) newErrors.email = "Email é obrigatório.";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Data de nascimento é obrigatória.";
    if (!formData.enrollmentNumber) newErrors.enrollmentNumber = "Matrícula é obrigatória.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!id) return;
    const updated = updateStudent(Number(id), formData);
    if (!updated) {
      alert("Erro ao atualizar aluno");
      return;
    }
    alert("Aluno atualizado com sucesso!");
    navigate("/students");
  };

  return (
    <div className={styles.container}>
      <h1>Editar Aluno</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.entries(formData).map(([key, val]) => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key}>{key}</label>
            <input
              id={key}
              name={key}
              type={key === "dateOfBirth" ? "date" : "text"}
              value={val}
              onChange={handleChange}
            />
            {errors[key as keyof Student] && (
              <span className={styles.error}>{errors[key as keyof Student]}</span>
            )}
          </div>
        ))}
        <div className={styles.actions}>
          <button type="submit" className={styles.btnPrimary}>
            Salvar Alterações
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
