// src/pages/Enrollments/wrappers.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import EnrollmentDetails from './Details/DetailsPage';
import EditEnrollment from './Edit/EditPage';
import DeleteEnrollment from './Delete/DeletePage';

import enrollmentsMock from '../../mocks/enrollments'; // default import
import type { Enrollment } from '../../types/enrollment';
import type { EnrollmentWithNames } from '../../types/enrollmentWithNames';

import { mockStudents } from '../../mocks/students';
import { mockClassRooms } from '../../mocks/classRooms'; // corrigido: import nomeado
import type { ClassRoom } from '../../types/ClassRoom';

// Transforma o Enrollment em EnrollmentWithNames
function getEnrollmentDetails(enrollment: Enrollment): EnrollmentWithNames {
  const student = mockStudents.find(s => s.id === enrollment.studentId);
  const classRoom: ClassRoom | undefined = mockClassRooms.find(c => c.id === enrollment.classRoomId);

  return {
    ...enrollment,
    studentName: student?.name ?? 'Aluno não informado',
    classRoomName: classRoom?.name ?? 'Turma não informada',
  };
}

// Wrapper de detalhes
export function EnrollmentDetailsWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<EnrollmentWithNames | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/enrollments');
      return;
    }

    const found = enrollmentsMock.find(e => e.id === Number(id));
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

// Wrapper de edição
export function EnrollmentEditWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/enrollments');
      return;
    }

    const found = enrollmentsMock.find(e => e.id === Number(id));
    if (!found) {
      alert('Matrícula não encontrada');
      navigate('/enrollments');
      return;
    }
    setEnrollment(found);
  }, [id, navigate]);

  async function onSave(updatedEnrollment: Enrollment) {
    const index = enrollmentsMock.findIndex(e => e.id === updatedEnrollment.id);
    if (index === -1) throw new Error('Matrícula não encontrada');
    enrollmentsMock[index] = updatedEnrollment;
    navigate('/enrollments');
  }

  if (!enrollment) return <div>Carregando matrícula...</div>;

  return <EditEnrollment enrollment={enrollment} onSave={onSave} />;
}

// Wrapper de exclusão
export function EnrollmentDeleteWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<EnrollmentWithNames | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/enrollments');
      return;
    }

    const found = enrollmentsMock.find(e => e.id === Number(id));
    if (!found) {
      alert('Matrícula não encontrada');
      navigate('/enrollments');
      return;
    }
    setEnrollment(getEnrollmentDetails(found));
  }, [id, navigate]);

  async function onDelete(idToDelete: number) {
    const index = enrollmentsMock.findIndex(e => e.id === idToDelete);
    if (index === -1) throw new Error('Matrícula não encontrada');
    enrollmentsMock.splice(index, 1);
    navigate('/enrollments');
  }

  if (!enrollment) return <div>Carregando matrícula...</div>;

  return <DeleteEnrollment enrollment={enrollment} onDelete={onDelete} />;
}
