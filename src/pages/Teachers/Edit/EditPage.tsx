// src/pages/Teachers/Edit/EditPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./EditPage.module.css";
import { useTeachers } from "../../../hooks/useTeachers";
import type { TeacherFormData } from "../../../types/TeacherFormData";

export default function TeacherEdit() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
    <>
      <h1 className={styles.title}>Editar Professor</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles["edit-container"]}>
          {[
            { label: "Nome", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Data de Nascimento", name: "dateOfBirth", type: "date" },
            { label: "Disciplina", name: "subject", type: "text" },
            { label: "Telefone", name: "phone", type: "tel" },
            { label: "Endereço", name: "address", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name} className={styles["form-group"]}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name as keyof TeacherFormData]}
                onChange={handleChange}
              />
              {errors[name as keyof TeacherFormData] && (
                <span className={styles["text-danger"]}>
                  {errors[name as keyof TeacherFormData]}
                </span>
              )}
            </div>
          ))}
          <button type="submit">Salvar</button>
        </div>
      </form>
      <button
        className={styles["btn-secondary"]}
        onClick={() => navigate("/teachers")}
        type="button"
      >
        Voltar à Lista
      </button>
    </>
  );
}
