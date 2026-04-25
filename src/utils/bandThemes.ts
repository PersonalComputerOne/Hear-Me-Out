export const bandThemes: Record<
  number,
  { gradient: string; palette: string[] }
> = {
  1: {
    gradient: "bg-gradient-to-r from-blue-500 to-purple-500",
    palette: ["#3c3a45", "#953119", "#e9eaed"],
  },
  2: {
    gradient: "bg-gradient-to-r from-green-500 to-yellow-500",
    palette: ["#114a37", "#451d1e", "#361a04"],
  },
  3: {
    gradient: "bg-gradient-to-r from-red-500 to-orange-500",
    palette: ["#daa24b", "#f57007", "#bfbfbf"],
  },
};
