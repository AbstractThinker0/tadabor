export function onlySpaces(str: string) {
  return str.trim().length === 0;
}

export function isBackendEnabled() {
  const betaVersion = localStorage.getItem("betaVersion"); // Check localStorage for betaVersion

  const appAPI = import.meta.env.VITE_API;

  return appAPI && betaVersion === "true";
}
