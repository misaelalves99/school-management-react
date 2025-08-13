// src/pages/Students/Details/DetailsPage.tsx

import { useParams, useNavigate } from 'react-router-dom';
import styles from './DetailsPage.module.css';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: fetch student by ID
  const student = {
    name: 'João da Silva',
    email: 'joao@email.com',
    dateOfBirth: '2001-09-15',
    enrollmentNumber: '2025001',
    phone: '(11) 99999-9999',
    address: 'Rua Exemplo, 123'
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalhes do Aluno</h1>
      <div><strong>Nome:</strong> {student.name}</div>
      <div><strong>Email:</strong> {student.email}</div>
      <div><strong>Data de Nascimento:</strong> {student.dateOfBirth}</div>
      <div><strong>Número de Matrícula:</strong> {student.enrollmentNumber}</div>
      <div><strong>Telefone:</strong> {student.phone}</div>
      <div><strong>Endereço:</strong> {student.address}</div>
      <div className={styles.actions}>
        <button className={styles.btnWarning} onClick={() => navigate(`/students/edit/${id}`)}>Editar</button>
        <button className={styles.btnSecondary} onClick={() => navigate('/students')}>Voltar à Lista</button>
      </div>
    </div>
  );
}
