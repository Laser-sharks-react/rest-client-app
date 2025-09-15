import { LS_KEYS } from '@/lib/types/ls-keys';
import type { VariablesState } from '@/lib/types/variable';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Variable = { id: string; key: string; value: string };

type VariablesStore = VariablesState & {
  addVariable: (p?: Omit<Variable, 'id'>) => string;
  removeVariable: (id: string) => void;
  updateVariableKey: (p: { id: string; key: string }) => void;
  updateVariableValue: (p: { id: string; value: string }) => void;
};

export const useVariablesStore = create<VariablesStore>()(
  persist(
    set => ({
      variables: [],

      addVariable: ({ key, value } = { key: '', value: '' }) => {
        const id = crypto.randomUUID();
        set(s => ({ variables: [...s.variables, { id, key, value }] }));
        return id;
      },

      removeVariable: id =>
        set(s => ({ variables: s.variables.filter(v => v.id !== id) })),

      updateVariableKey: ({ id, key }) =>
        set(s => ({
          variables: s.variables.map(v => (v.id === id ? { ...v, key } : v)),
        })),

      updateVariableValue: ({ id, value }) =>
        set(s => ({
          variables: s.variables.map(v => (v.id === id ? { ...v, value } : v)),
        })),
    }),
    {
      name: LS_KEYS.variables,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ variables: state.variables }),
    }
  )
);
