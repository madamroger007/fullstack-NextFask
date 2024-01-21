export const CamelCase = (backendName: string): string => {
  return backendName.charAt(0).toLocaleUpperCase() + backendName.substring(1);
};