// src/pages/Enrollments/wrappers.tsx

import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import EnrollmentDetails from './Details/DetailsPage';
import EditEnrollment from './Edit/EditPage';
import DeleteEnrollment from './Delete/DeletePage';

import { useEnrollments } from '../../hooks/useEnrollments';
import { useStudents } from '../../hooks/useStudents';
import { useClassRooms } from '../../hooks/useClassRooms';
import type { Enrollment } from '../../types/enrollment';
import type { EnrollmentWithNames } from '../../types/enrollmentWithNames';

// Converte Enrollment em EnrollmentWithNames
function getEnrollmentDetails(
  enrollment: Enrollment,
  students: ReturnType<typeof useStudents>['students'],
  classRooms: ReturnType<typeof useClassRooms>['classRooms']
): EnrollmentWithNames {
  const student = students.find(s => s.id === enrollment.studentId);
  const classRoom = classRooms.find(c => c.id === enrollment.classRoomId);
  return {
    ...enrollment,
    studentName: student?.name ?? 'Aluno não informado',
    classRoomName: classRoom?.name ?? 'Turma não informada',
  };
}

// Wrapper Detalhes
export function EnrollmentDetailsWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enrollments } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();

  const [enrollment, setEnrollment] = useState<EnrollmentWithNames | null>(null);

  useEffect(() => {
    if (!id) { navigate('/enrollments'); return; }
    const found = enrollments.find(e => e.id === Number(id));
    if (!found) { alert('Matrícula não encontrada'); navigate('/enrollments'); return; }
    setEnrollment(getEnrollmentDetails(found, students, classRooms));
  }, [id, enrollments, navigate, students, classRooms]);

  if (!enrollment) return <div>Carregando matrícula...</div>;
  return <EnrollmentDetails enrollment={enrollment} />;
}

// Wrapper Edição
export function EnrollmentEditWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enrollments, updateEnrollment } = useEnrollments();

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);

  useEffect(() => {
    if (!id) { navigate('/enrollments'); return; }
    const found = enrollments.find(e => e.id === Number(id));
    if (!found) { alert('Matrícula não encontrada'); navigate('/enrollments'); return; }
    setEnrollment(found);
  }, [id, enrollments, navigate]);

  async function onSave(updatedEnrollment: Enrollment): Promise<void> {
    const updated = await updateEnrollment(updatedEnrollment);
    if (!updated) { alert('Erro ao atualizar matrícula'); return; }
    navigate('/enrollments');
  }

  if (!enrollment) return <div>Carregando matrícula...</div>;
  return <EditEnrollment enrollment={enrollment} onSave={onSave} />;
}

// Wrapper Exclusão
export function EnrollmentDeleteWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enrollments, removeEnrollment } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();

  const [enrollment, setEnrollment] = useState<EnrollmentWithNames | null>(null);

  useEffect(() => {
    if (!id) { navigate('/enrollments'); return; }
    const found = enrollments.find(e => e.id === Number(id));
    if (!found) { alert('Matrícula não encontrada'); navigate('/enrollments'); return; }
    setEnrollment(getEnrollmentDetails(found, students, classRooms));
  }, [id, enrollments, navigate, students, classRooms]);

  async function onDelete(idToDelete: number) {
    removeEnrollment(idToDelete);
    navigate('/enrollments');
  }

  if (!enrollment) return <div>Carregando matrícula...</div>;
  return <DeleteEnrollment enrollment={enrollment} onDelete={onDelete} />;
}
