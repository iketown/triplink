export const addVarsToCloudinaryURL = (origUrl: string, vars: string) => {
  const parts = origUrl.split("upload/");
  return `${parts[0]}upload/${vars}/${parts[1]}`;
};
