export const generateId = () => {
  return `file-${Math.random().toString(36).substr(2, 9)}`;
};
