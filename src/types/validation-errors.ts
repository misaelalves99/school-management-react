// src/types/validationErrors.ts

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;
