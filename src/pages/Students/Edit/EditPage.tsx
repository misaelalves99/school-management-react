// src/pages/Students/Edit/EditPage.tsx

// src/pages/Students/Edit/EditPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditPage.module.css";
import type { Student } from "../../../types/Student";
import { useStudents } from "../../../hooks/useStudents";

export default function StudentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, editStudent } = useStudents();

  const [formData, setFormData] = useState<Omit<Student, "id">>({
    name: "",
    email: "",
    dateOfBirth: "",
    enrollmentNumber: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Student, "id">, string>>>({});

  useEffect(() => {
    if (!id) return;
    const student = students.find(s => s.id === Number(id));
    if (!student) {
      alert("Aluno não encontrado");
      navigate("/students");
      return;
    }
    setFormData({
      name: student.name,
      email: student.email,
      dateOfBirth: student.dateOfBirth,
      enrollmentNumber: student.enrollmentNumber,
      phone: student.phone,
      address: student.address,
    });
  }, [id, students, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    const updated = editStudent(Number(id), formData);
    if (!updated) {
      alert("Erro ao atualizar aluno");
      return;
    }

    alert("Aluno atualizado com sucesso!");
    navigate("/students");
  };

  const fields = [
    { key: "name", label: "Nome", placeholder: "Digite o nome do aluno", type: "text" },
    { key: "email", label: "Email", placeholder: "Digite o email", type: "email" },
    { key: "dateOfBirth", label: "Data de Nascimento", placeholder: "", type: "date" },
    { key: "enrollmentNumber", label: "Matrícula", placeholder: "Número de matrícula", type: "text" },
    { key: "phone", label: "Telefone", placeholder: "Digite o telefone", type: "tel" },
    { key: "address", label: "Endereço", placeholder: "Digite o endereço", type: "text" },
  ];

  return (
    <div className={styles.createContainer}>
      <h1 className={styles.createTitle}>Editar Aluno</h1>
      <form onSubmit={handleSubmit} className={styles.createForm}>
        {fields.map(({ key, label, placeholder, type }) => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key} className={styles.formLabel}>{label}</label>
            <input
              id={key}
              name={key}
              type={type}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              placeholder={placeholder}
              className={styles.formInput}
            />
            {errors[key as keyof typeof formData] && (
              <span className={styles.formError}>{errors[key as keyof typeof formData]}</span>
            )}
          </div>
        ))}

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary}>Salvar Alterações</button>
          <button type="button" className={styles.btnSecondary} onClick={() => navigate("/students")}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
