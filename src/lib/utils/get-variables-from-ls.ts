import { LS_KEYS } from '../types/ls-keys';
import type { Variable } from '../types/variable';

export function getVariablesFromLS() {
  try {
    const variablesStateRaw = localStorage.getItem(LS_KEYS.variables) || '';
    const variablesState: { state: Variable[] } = JSON.parse(variablesStateRaw);
    const variables = variablesState.state;
    return variables;
  } catch {
    return [];
  }
}
