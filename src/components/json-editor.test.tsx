import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JsonEditor from './json-editor';

jest.mock('prismjs', () => ({
  highlight: (src: string) => src,
  languages: { json: {} },
}));
jest.mock('prismjs/components/prism-json', () => ({}));

jest.mock('react-simple-code-editor', () => {
  return function EditorMock({
    value,
    onValueChange,
    style,
    textareaId,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    style?: React.CSSProperties;
    textareaId?: string;
  }) {
    return (
      <textarea
        data-testid="json-editor-textarea"
        id={textareaId}
        value={value}
        onChange={e => onValueChange(e.target.value)}
        style={style}
      />
    );
  };
});

describe('JsonEditor', () => {
  test("renders default JSON, if there isn't initial", () => {
    render(<JsonEditor />);
    const textArea = screen.getByTestId('json-editor-textarea');
    if (!(textArea instanceof HTMLTextAreaElement)) {
      throw new Error('Expected textarea element');
    }
    expect(textArea.value).toBe('{\n  "hello": "world"\n}');
    expect(screen.getByText('JsonEditor.valid')).toBeInTheDocument();
  });

  test('use initial and calls onValidChange for valid JSON', () => {
    const onValidChange = jest.fn();
    render(<JsonEditor initial='{"a":1}' onValidChange={onValidChange} />);
    const textArea = screen.getByTestId('json-editor-textarea');
    if (!(textArea instanceof HTMLTextAreaElement)) {
      throw new Error('Expected textarea element');
    }
    expect(textArea.value).toBe('{"a":1}');
    expect(onValidChange).toHaveBeenCalledWith('{"a":1}');
  });

  test('shows error and disable Format when invalid JSON', () => {
    render(<JsonEditor initial='{"a":1}' />);
    const textArea = screen.getByTestId('json-editor-textarea');
    if (!(textArea instanceof HTMLTextAreaElement)) {
      throw new Error('Expected textarea element');
    }
    fireEvent.change(textArea, { target: { value: '{ invalid }' } });

    expect(screen.getByText(/JsonEditor\.invalid:/)).toBeInTheDocument();

    const formatBtn = screen.getByRole('button', { name: 'JsonEditor.format' });
    expect(formatBtn).toBeDisabled();
  });

  test('onValidChange calls when valid JSON on change', () => {
    const onValidChange = jest.fn();
    render(<JsonEditor onValidChange={onValidChange} />);
    const textArea = screen.getByTestId('json-editor-textarea');
    if (!(textArea instanceof HTMLTextAreaElement)) {
      throw new Error('Expected textarea element');
    }
    fireEvent.change(textArea, { target: { value: '{"b":2}' } });
    expect(onValidChange).toHaveBeenLastCalledWith('{"b":2}');

    expect(screen.getByText('JsonEditor.valid')).toBeInTheDocument();
  });

  test('button Format formats JSON with default gap 2', () => {
    render(<JsonEditor initial='{"a":1,"b":{"c":2}}' />);
    const textArea = screen.getByTestId('json-editor-textarea');
    if (!(textArea instanceof HTMLTextAreaElement)) {
      throw new Error('Expected textarea element');
    }
    const formatBtn = screen.getByRole('button', { name: 'JsonEditor.format' });
    fireEvent.click(formatBtn);

    expect(textArea.value).toBe('{\n  "a": 1,\n  "b": {\n    "c": 2\n  }\n}');
  });

  test('format considers custom indent', () => {
    render(<JsonEditor initial='{"a":1}' indent={4} />);
    const textArea = screen.getByTestId('json-editor-textarea');
    if (!(textArea instanceof HTMLTextAreaElement)) {
      throw new Error('Expected textarea element');
    }
    const formatBtn = screen.getByRole('button', { name: 'JsonEditor.format' });
    fireEvent.click(formatBtn);

    expect(textArea.value).toBe('{\n    "a": 1\n}');
  });
});
