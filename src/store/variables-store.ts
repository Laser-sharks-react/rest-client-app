import { LS_KEYS } from '@/lib/types/ls-keys';
import type { Variable, VariablesState } from '@/lib/types/variable';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Actions = {
  addVariable: (variable?: Omit<Variable, 'id'>) => string;
  removeVariable: (id: string) => void;
  updateVariableKey: (variable: Omit<Variable, 'value'>) => void;
  updateVariableValue: (variable: Omit<Variable, 'key'>) => void;
  reset: () => void;
};

export const useVariablesStore = create<VariablesState & Actions>()(
  persist(
    set => ({
      variables: [],

      addVariable: ({ key, value } = { key: '', value: '' }) => {
        const id = crypto.randomUUID();
        set(state => ({ variables: [...state.variables, { id, key, value }] }));
        return id;
      },

      removeVariable: id =>
        set(state => ({
          variables: state.variables.filter(variable => variable.id !== id),
        })),

      updateVariableKey: ({ id, key }) =>
        set(state => ({
          variables: state.variables.map(variable =>
            variable.id === id ? { ...variable, key } : variable
          ),
        })),

      updateVariableValue: ({ id, value }) =>
        set(state => ({
          variables: state.variables.map(variable =>
            variable.id === id ? { ...variable, value } : variable
          ),
        })),
      reset: () => set({ variables: [] }),
    }),
    {
      name: LS_KEYS.variables,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ variables: state.variables }),
    }
  )
);
