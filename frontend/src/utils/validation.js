import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './constants';

export const validateFile = (file) => {
  const errors = [];
  if (!file) {
    errors.push('No file provided');
    return { valid: false, errors };
  }
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.push('File must be an Excel file (.xlsx or .xls)');
  }
  return { valid: errors.length === 0, errors };
};

export const validateExcelData = (data) => {
  const errors = [];
  if (!data.company?.name) errors.push('Company name is required');
  if (!data.company?.description) errors.push('Company description is required');
  if (!data.company?.subreddits?.length) errors.push('At least one subreddit is required');
  if (!data.personas?.length) errors.push('At least one persona is required');
  if (!data.keywords?.length) errors.push('At least one keyword is required');
  return { valid: errors.length === 0, errors };
};
