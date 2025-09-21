import { render, screen, fireEvent, within } from '@testing-library/react';
import { VariablesList } from './variables-list';

type Variable = { id: string; key: string; value: string };

type AddVariable = () => string;
type RemoveVariable = (id: string) => void;
type UpdateVariableKey = (value: { id: string; key: string }) => void;
type UpdateVariableValue = (value: { id: string; value: string }) => void;

type Store = {
  variables: Variable[];
  addVariable: AddVariable;
  removeVariable: RemoveVariable;
  updateVariableKey: UpdateVariableKey;
  updateVariableValue: UpdateVariableValue;
};

const addVariable: jest.MockedFunction<AddVariable> = jest.fn(() => 'new-id');
const removeVariable: jest.MockedFunction<RemoveVariable> = jest.fn();
const updateVariableKey: jest.MockedFunction<UpdateVariableKey> = jest.fn();
const updateVariableValue: jest.MockedFunction<UpdateVariableValue> = jest.fn();

const initialStore: Store = {
  variables: [],
  addVariable,
  removeVariable,
  updateVariableKey,
  updateVariableValue,
};

let store: Store = { ...initialStore };

function setStore(partial: Partial<Store>): void {
  store = { ...store, ...partial };
}

jest.mock('@/store/variables-store', () => {
  function useVariablesStore<T>(selector: (s: Store) => T): T {
    return selector(store);
  }
  return {
    __esModule: true as const,
    useVariablesStore,
  };
});

beforeEach(() => {
  addVariable.mockClear();
  removeVariable.mockClear();
  updateVariableKey.mockClear();
  updateVariableValue.mockClear();
  store = { ...initialStore, variables: [] };
});

describe('VariablesList', () => {
  test('renders title and Add button, calls addVariable on click', () => {
    render(<VariablesList />);

    expect(
      screen.getByRole('heading', { name: 'VariablesList.variables', level: 5 })
    ).toBeInTheDocument();

    const addBtn = screen.getByRole('button', { name: '' });
    fireEvent.click(addBtn);

    expect(addVariable).toHaveBeenCalledTimes(1);
  });

  test('renders variable rows and updates key/value on change', () => {
    setStore({
      variables: [
        { id: 'id1', key: 'keyTest1', value: 'value123' },
        { id: 'id2', key: 'keyyyTest2', value: '456value' },
      ],
    });

    render(<VariablesList />);

    const keyInputs = screen.getAllByRole('textbox', {
      name: 'VariablesList.key',
    });
    const valInputs = screen.getAllByRole('textbox', {
      name: 'VariablesList.value',
    });
    expect(keyInputs).toHaveLength(2);
    expect(valInputs).toHaveLength(2);

    fireEvent.change(keyInputs[0], { target: { value: 'newValue' } });
    expect(updateVariableKey).toHaveBeenCalledWith({
      id: 'id1',
      key: 'newValue',
    });

    fireEvent.change(valInputs[0], { target: { value: '456' } });
    expect(updateVariableValue).toHaveBeenCalledWith({
      id: 'id1',
      value: '456',
    });
  });

  test('removes variable on Delete click', () => {
    setStore({
      variables: [{ id: 'id1', key: 'key', value: 'value' }],
    });

    const { container } = render(<VariablesList />);

    const rows = container.querySelectorAll('div.MuiStack-root');
    const rowWithFields = Array.from(rows).find(el => {
      return (
        el.querySelector('input[name="Key"]') &&
        el.querySelector('input[name="Value"]')
      );
    });
    if (!(rowWithFields instanceof HTMLElement)) {
      throw new Error('Expected row with key, value inputs');
    }
    const deleteBtn = within(rowWithFields).getByRole('button');
    fireEvent.click(deleteBtn);

    expect(removeVariable).toHaveBeenCalledWith('id1');
  });
});
