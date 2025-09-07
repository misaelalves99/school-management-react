// src/pages/Enrollments/wrappers.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import EnrollmentDetails from './Details/DetailsPage';
import EditEnrollment from './Edit/EditPage';
import DeleteEnrollment from './Delete/DeletePage';

import { useEnrollments } from '../../hooks/useEnrollments';
import { useStudents } from '../../hooks/useStudents';
import { useClassRooms } from '../../hooks/useClassRooms';
import type { Enrollment } from '../../types/Enrollment';
import type { EnrollmentEdit } from '../../types/EnrollmentEdit';
import type { EnrollmentWithNames } from '../../types/EnrollmentWithNames';

// Função auxiliar para mapear Enrollment → EnrollmentWithNames
function getEnrollmentDetails(
  enrollment: Enrollment,
  students: ReturnType<typeof useStudents>['students'] = [],
  classRooms: ReturnType<typeof useClassRooms>['classRooms'] = []
): EnrollmentWithNames {
  const student = students.find(s => s.id === enrollment.studentId);
  const classRoom = classRooms.find(c => c.id === enrollment.classRoomId);
  return {
    ...enrollment,
    studentName: student?.name ?? 'Aluno não informado',
    classRoomName: classRoom?.name ?? 'Turma não informada',
  };
}

// ==============================
// Wrapper Detalhes
// ==============================
export function EnrollmentDetailsWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enrollments } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();

  const [enrollment, setEnrollment] = useState<EnrollmentWithNames | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/enrollments');
      return;
    }

    const found = enrollments.find(e => e.id === Number(id));
    if (!found) {
      alert('Matrícula não encontrada');
      navigate('/enrollments');
      return;
    }

    setEnrollment(getEnrollmentDetails(found, students, classRooms));
  }, [id, enrollments, students, classRooms, navigate]);

  if (!enrollment) return <div>Carregando matrícula...</div>;
  return <EnrollmentDetails enrollment={enrollment} />;
}

// ==============================
// Wrapper Edição
// ==============================
export function EnrollmentEditWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enrollments, updateEnrollment } = useEnrollments();

  const [enrollment, setEnrollment] = useState<EnrollmentEdit | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/enrollments');
      return;
    }

    const found = enrollments.find(e => e.id === Number(id));
    if (!found) {
      alert('Matrícula não encontrada');
      navigate('/enrollments');
      return;
    }

    setEnrollment({
      id: found.id,
      studentId: found.studentId,
      classRoomId: found.classRoomId,
      enrollmentDate: found.enrollmentDate,
      status: found.status,
    });
  }, [id, enrollments, navigate]);

  async function onSave(updatedEnrollment: EnrollmentEdit) {
    if (!enrollment) return;

    const payload: Enrollment = {
      id: updatedEnrollment.id,
      studentId: updatedEnrollment.studentId || 0,
      classRoomId: updatedEnrollment.classRoomId || 0,
      enrollmentDate: updatedEnrollment.enrollmentDate || new Date().toISOString(),
      status: updatedEnrollment.status || 'Ativa',
    };

    try {
      const updated = await updateEnrollment(payload);
      if (!updated) {
        alert('Erro ao atualizar matrícula');
        return;
      }
      navigate('/enrollments');
    } catch (err) {
      console.error('Erro ao salvar matrícula:', err);
      alert('Ocorreu um erro ao salvar a matrícula.');
    }
  }

  if (!enrollment) return <div>Carregando matrícula...</div>;
  return <EditEnrollment enrollment={enrollment} onSave={onSave} />;
}

// ==============================
// Wrapper Exclusão
// ==============================
export function EnrollmentDeleteWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enrollments, removeEnrollment } = useEnrollments();
  const { students } = useStudents();
  const { classRooms } = useClassRooms();

  const [enrollment, setEnrollment] = useState<EnrollmentWithNames | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/enrollments');
      return;
    }

    const found = enrollments.find(e => e.id === Number(id));
    if (!found) {
      alert('Matrícula não encontrada');
      navigate('/enrollments');
      return;
    }

    setEnrollment(getEnrollmentDetails(found, students, classRooms));
  }, [id, enrollments, students, classRooms, navigate]);

  async function onDelete(idToDelete: number) {
    try {
      await removeEnrollment(idToDelete);
      navigate('/enrollments');
    } catch (err) {
      console.error('Erro ao excluir matrícula:', err);
      alert('Ocorreu um erro ao excluir a matrícula.');
    }
  }

  if (!enrollment) return <div>Carregando matrícula...</div>;
  return <DeleteEnrollment enrollment={enrollment} onDelete={onDelete} />;
}
