export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];
export const QUALITY_THRESHOLDS = { HIGH: 8.0, MEDIUM: 6.0, LOW: 0 };
