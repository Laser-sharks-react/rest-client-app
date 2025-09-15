export type Variable = {
  id: string;
  key: string;
  value: string;
};

export type VariableMatch = {
  name: string;
  start: number;
  end: number;
  raw: string;
};
