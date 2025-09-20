import { describe, expect, test } from '@jest/globals';
import { useRequestStore } from './request-store';

let rndSpy: jest.SpyInstance<string, []>;
beforeAll(() => {
  rndSpy = jest.spyOn(global.crypto, 'randomUUID').mockReturnValue('uuid-rest');
});

afterAll(() => {
  rndSpy.mockRestore();
});

beforeEach(() => {
  rndSpy
    .mockReset()
    .mockReturnValueOnce('uuid-1')
    .mockReturnValueOnce('uuid-2')
    .mockReturnValue('uuid-rest');

  useRequestStore.getState().reset();
});

describe('useRequestStore (Zustand)', () => {
  test('initial state is correct', () => {
    const state = useRequestStore.getState();
    expect(state.method).toBe('GET');
    expect(state.url).toBe('');
    expect(state.body).toBe('');
    expect(state.headers).toEqual([]);
  });

  test('setMethod / setUrl / setBody works', () => {
    const { setMethod, setUrl, setBody } = useRequestStore.getState();
    setMethod('POST');
    setUrl('https://api.example.com/users');
    setBody('{"ok":true}');

    const state = useRequestStore.getState();
    expect(state.method).toBe('POST');
    expect(state.url).toBe('https://api.example.com/users');
    expect(state.body).toBe('{"ok":true}');
  });

  test('addHeader creates record with determinated id and empty fields by default', () => {
    const { addHeader } = useRequestStore.getState();
    addHeader();

    const state = useRequestStore.getState();
    expect(state.headers).toHaveLength(1);
    expect(state.headers[0]).toEqual({ id: 'uuid-1', key: '', value: '' });
    expect(global.crypto.randomUUID).toHaveBeenCalledTimes(1);
  });

  test('addHeader with init and next updateHeaderKey/Value updates the record', () => {
    const { addHeader, updateHeaderKey, updateHeaderValue } =
      useRequestStore.getState();

    addHeader({ key: 'Accept', value: 'application/json' });
    let state = useRequestStore.getState();
    expect(state.headers[0]).toEqual({
      id: 'uuid-1',
      key: 'Accept',
      value: 'application/json',
    });

    updateHeaderKey({ id: 'uuid-1', key: 'Content-Type' });
    updateHeaderValue({ id: 'uuid-1', value: 'text/plain' });

    state = useRequestStore.getState();
    expect(state.headers[0]).toEqual({
      id: 'uuid-1',
      key: 'Content-Type',
      value: 'text/plain',
    });
  });

  test("updateHeaderKey/Value with not existing id doesn't change state", () => {
    const { addHeader, updateHeaderKey, updateHeaderValue } =
      useRequestStore.getState();
    addHeader({ key: 'key', value: 'value' });

    const prev = useRequestStore.getState().headers;
    updateHeaderKey({ id: 'key1', key: 'value1' });
    updateHeaderValue({ id: 'key1', value: 'value2' });

    const next = useRequestStore.getState().headers;
    expect(next).toEqual(prev);
  });

  test('removeHeader deletes by id and ignores not existing', () => {
    const { addHeader, removeHeader } = useRequestStore.getState();
    addHeader({ key: 'keyTest1', value: 'valueTest1' });
    addHeader({ key: 'keyTest2', value: 'valueTest2' });

    expect(useRequestStore.getState().headers).toHaveLength(2);

    removeHeader('uuid-1');
    expect(useRequestStore.getState().headers).toHaveLength(1);
    expect(useRequestStore.getState().headers[0].id).toBe('uuid-2');

    removeHeader('missing');
    expect(useRequestStore.getState().headers).toHaveLength(1);
  });

  test('clearHeaders deletes only headers, leaving everything else intact', () => {
    const { addHeader, clearHeaders, setMethod, setUrl, setBody } =
      useRequestStore.getState();
    addHeader({ key: 'key', value: 'value' });
    setMethod('PUT');
    setUrl('/x');
    setBody('body');

    clearHeaders();

    const state = useRequestStore.getState();
    expect(state.headers).toEqual([]);
    expect(state.method).toBe('PUT');
    expect(state.url).toBe('/x');
    expect(state.body).toBe('body');
  });

  test('reset returns everything to initialState', () => {
    const { addHeader, setMethod, setUrl, setBody, reset } =
      useRequestStore.getState();
    setMethod('DELETE');
    setUrl('url');
    setBody('body');
    addHeader({ key: 'key', value: 'value' });

    reset();

    const state = useRequestStore.getState();
    expect(state.method).toBe('GET');
    expect(state.url).toBe('');
    expect(state.body).toBe('');
    expect(state.headers).toEqual([]);
  });
});
