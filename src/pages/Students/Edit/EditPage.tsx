// src/pages/Students/Edit/EditPage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditPage.module.css';

// Mock simples de dados para exemplo:
const mockStudents = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    dateOfBirth: '2000-01-01',
    enrollmentNumber: '20230001',
    phone: '123456789',
    address: 'Rua A',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@example.com',
    dateOfBirth: '1999-05-15',
    enrollmentNumber: '20230002',
    phone: '987654321',
    address: 'Rua B',
  },
];

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    enrollmentNumber: '',
    phone: '',
    address: '',
  });

  // Carrega dados do aluno pelo id assim que o componente monta
  useEffect(() => {
    if (!id) {
      alert('ID do aluno não fornecido.');
      navigate('/students');
      return;
    }

    const student = mockStudents.find((s) => s.id === id);
    if (!student) {
      alert('Aluno não encontrado.');
      navigate('/students');
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
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: salvar aluno editado via API ou state global
    alert('Aluno atualizado!');
    navigate('/students');
  };

  return (
    <>
      <h1 className={styles.title}>Editar Aluno</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.entries(formData).map(([key, val]) => (
          <div key={key} className={styles.formGroup}>
            <label htmlFor={key}>{key}</label>
            <input
              id={key}
              name={key}
              type={key === 'dateOfBirth' ? 'date' : 'text'}
              value={val}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className={styles.actions}>
          <button type="submit" className={styles.btnPrimary}>Salvar Alterações</button>
          <button type="button" className={styles.btnSecondary} onClick={() => navigate('/students')}>Voltar</button>
        </div>
      </form>
    </>
  );
}
