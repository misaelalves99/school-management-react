// src/types/ClassRoom.ts

import type { Subject } from "./subject";
import type { Teacher } from "./teacher";

export interface ClassRoom {
  id: number;
  name: string;
  capacity: number;
  schedule: string;
  subjects: Subject[];
  teachers: Teacher[];
  classTeacher?: Teacher; // opcional
}
