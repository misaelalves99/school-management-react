// src/mocks/classRooms.test.ts
import {
  classRoomsData,
  getClassRooms,
  getClassRoomById,
  createClassRoom,
  updateClassRoom,
  deleteClassRoom,
} from './ClassRooms';

describe('classRooms mocks', () => {
  beforeEach(() => {
    // Resetar o array para estado inicial antes de cada teste
    while (classRoomsData.length > 0) classRoomsData.pop();
    classRoomsData.push(
      {
        id: 1,
        name: 'Sala A',
        capacity: 30,
        schedule: 'Seg - 08:00 às 10:00',
        subjects: [],
        teachers: [],
        classTeacher: undefined,
      },
      {
        id: 2,
        name: 'Sala B',
        capacity: 25,
        schedule: 'Ter - 10:00 às 12:00',
        subjects: [],
        teachers: [],
        classTeacher: undefined,
      }
    );
  });

  it('getClassRooms deve retornar todas as salas', () => {
    const rooms = getClassRooms();
    expect(rooms.length).toBe(2);
    expect(rooms[0].name).toBe('Sala A');
  });

  it('getClassRoomById deve retornar a sala correta', () => {
    const room = getClassRoomById(1);
    expect(room).toBeDefined();
    expect(room?.name).toBe('Sala A');
  });

  it('getClassRoomById deve retornar undefined se não existir', () => {
    const room = getClassRoomById(999);
    expect(room).toBeUndefined();
  });

  it('createClassRoom deve adicionar uma nova sala', () => {
    const newRoom = createClassRoom({
      name: 'Sala C',
      capacity: 20,
      schedule: 'Qua - 13:00 às 15:00',
      subjects: [],
      teachers: [],
      classTeacher: undefined,
    });
    expect(newRoom.id).toBeGreaterThan(0);
    expect(classRoomsData).toContainEqual(newRoom);
  });

  it('updateClassRoom deve atualizar uma sala existente', () => {
    const updated = updateClassRoom(1, { name: 'Sala Atualizada' });
    expect(updated).toBeDefined();
    expect(updated?.name).toBe('Sala Atualizada');
    expect(classRoomsData.find(cr => cr.id === 1)?.name).toBe('Sala Atualizada');
  });

  it('updateClassRoom deve retornar null se a sala não existir', () => {
    const updated = updateClassRoom(999, { name: 'Inválida' });
    expect(updated).toBeNull();
  });

  it('deleteClassRoom deve remover a sala correta', () => {
    deleteClassRoom(1);
    expect(classRoomsData.find(cr => cr.id === 1)).toBeUndefined();
    expect(classRoomsData.length).toBe(1);
  });
});
