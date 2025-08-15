// src/pages/Subjects/Edit/EditPage.tsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditPage.module.css";
import type { Subject } from "../../../types/Subject";
import { useSubjects } from "../../../hooks/useSubjects";

export default function SubjectEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getSubjectById, updateSubject } = useSubjects();

  const [subject, setSubject] = useState<Omit<Subject, "id">>({
    name: "",
    description: "",
    workloadHours: 0,
  });

  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (!id) {
      alert("ID da disciplina não fornecido.");
      navigate("/subjects");
      return;
    }

    const subjectId = Number(id);

    // USAR O HOOK CORRETAMENTE
    const found = getSubjectById(subjectId);

    if (!found) {
      alert("Disciplina não encontrada.");
      navigate("/subjects");
      return;
    }

    setSubject({
      name: found.name,
      description: found.description,
      workloadHours: found.workloadHours,
    });
  }, [id, navigate, getSubjectById]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSubject(prev => ({
      ...prev,
      [name]: name === "workloadHours" ? Number(value) : value,
    }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!subject.name.trim()) {
      newErrors.name = "O nome da disciplina é obrigatório.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updated = updateSubject(Number(id), subject);
    if (!updated) {
      alert("Erro ao atualizar a disciplina.");
      return;
    }

    alert("Disciplina atualizada com sucesso!");
    navigate("/subjects");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar Disciplina</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Nome da Disciplina</label>
          <input
            type="text"
            id="name"
            name="name"
            value={subject.name}
            onChange={handleChange}
          />
          {errors.name && (
            <span className={styles.textDanger}>{errors.name}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={subject.description}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="workloadHours">Carga Horária</label>
          <input
            type="number"
            id="workloadHours"
            name="workloadHours"
            value={subject.workloadHours}
            onChange={handleChange}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Salvar Alterações
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => navigate("/subjects")}
          >
            Voltar à Lista
          </button>
        </div>
      </form>
    </div>
  );
}
