// src/pages/Enrollments/wrappers.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import EnrollmentDetails from './Details/DetailsPage';
import EditEnrollment from './Edit/EditPage';
import DeleteEnrollment from './Delete/DeletePage';

import { getEnrollmentById, deleteEnrollment, updateEnrollment } from '../../mocks/enrollmentsService';
import { Enrollment } from '../../mocks/enrollments';

// Import mocks to get student and classroom names
import { mockStudents } from '../../mocks/students';
import mockClassRooms from '../../mocks/classRooms';

// Define a new type that combines Enrollment with the additional names
interface DetailedEnrollment extends Enrollment {
  studentName: string;
  classRoomName: string;
}

// This function transforms the raw Enrollment object into a more detailed one
function getEnrollmentDetails(enrollment: Enrollment): DetailedEnrollment {
  const student = mockStudents.find(s => s.id === enrollment.studentId);
  const classRoom = mockClassRooms.find(c => c.id === enrollment.classRoomId);

  return {
    ...enrollment,
    studentName: student?.name ?? 'Aluno não informado',
    classRoomName: classRoom?.name ?? 'Turma não informada',
  };
}

export function EnrollmentDetailsWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<DetailedEnrollment | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/enrollments');
      return;
    }

    const found = getEnrollmentById(Number(id));
    if (!found) {
      alert('Matrícula não encontrada');
      navigate('/enrollments');
      return;
    }
    setEnrollment(getEnrollmentDetails(found));
  }, [id, navigate]);

  if (!enrollment) return <div>Carregando matrícula...</div>;

  return <EnrollmentDetails enrollment={enrollment} />;
}

export function EnrollmentEditWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/enrollments');
      return;
    }

    const found = getEnrollmentById(Number(id));
    if (!found) {
      alert('Matrícula não encontrada');
      navigate('/enrollments');
      return;
    }
    setEnrollment(found);
  }, [id, navigate]);

  async function onSave(updatedEnrollment: Enrollment) {
    const success = updateEnrollment(updatedEnrollment);
    if (!success) {
      throw new Error('Erro ao atualizar matrícula');
    }
    navigate('/enrollments');
  }

  if (!enrollment) return <div>Carregando matrícula...</div>;

  return <EditEnrollment enrollment={enrollment} onSave={onSave} />;
}

export function EnrollmentDeleteWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<DetailedEnrollment | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/enrollments');
      return;
    }

    const found = getEnrollmentById(Number(id));
    if (!found) {
      alert('Matrícula não encontrada');
      navigate('/enrollments');
      return;
    }
    setEnrollment(getEnrollmentDetails(found));
  }, [id, navigate]);

  async function onDelete(idToDelete: number) {
    const success = deleteEnrollment(idToDelete);
    if (!success) {
      throw new Error('Erro ao excluir matrícula');
    }
    navigate('/enrollments');
  }

  if (!enrollment) return <div>Carregando matrícula...</div>;

  return <DeleteEnrollment enrollment={enrollment} onDelete={onDelete} />;
}
