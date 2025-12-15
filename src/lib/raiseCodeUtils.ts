/**
 * Generates a short 8-char alphanumeric ID
 * @returns A string with 8 alphanumeric characters
 */
export const generateRaiseId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};
