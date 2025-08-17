// src/types/Classroom.ts

import { Subject } from './Subject';
import { Teacher } from './Teacher';

export interface ClassRoom {
  id: number;
  name: string;
  capacity: number;
  schedule: string;
  subjects?: Subject[];
  teachers?: Teacher[];
  classTeacher?: Teacher | null;
}
