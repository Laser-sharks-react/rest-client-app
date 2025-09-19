import { LS_KEYS } from '@/lib/types/ls-keys';
import type { VariablesState } from '@/lib/types/variable';

export function getVariablesFromLS() {
  try {
    const variablesStateRaw = localStorage.getItem(LS_KEYS.variables) || '';
    const variablesState: { state: VariablesState } =
      JSON.parse(variablesStateRaw);
    return variablesState.state.variables;
  } catch {
    return [];
  }
}
