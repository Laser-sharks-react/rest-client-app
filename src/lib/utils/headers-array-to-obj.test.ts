import { describe, it, expect } from '@jest/globals';
import { headersArrayToObj } from './headers-array-to-obj';

describe('headersArrayToObj', () => {
  it('преобразует массив заголовков в объект', () => {
    const headers = [
      { id: '1', key: 'Authorization', value: 'Bearer x' },
      { id: '2', key: 'X-Id', value: '123' },
    ];
    expect(headersArrayToObj(headers)).toEqual({
      Authorization: 'Bearer x',
      'X-Id': '123',
    });
  });

  it('игнорирует элементы с пустым или пробельным ключом', () => {
    const headers = [
      { id: '1', key: 'Content-Type', value: 'application/json' },
      { id: '2', key: '', value: 'should-be-ignored' },
      { id: '3', key: '   ', value: 'also-ignored' },
    ];
    expect(headersArrayToObj(headers)).toEqual({
      'Content-Type': 'application/json',
    });
  });

  it('не обрезает пробелы у ключа в результате (фильтрует только пустые)', () => {
    const headers = [{ id: '1', key: '  X-Token  ', value: 'abc' }];
    expect(headersArrayToObj(headers)).toEqual({
      '  X-Token  ': 'abc',
    });
  });

  it('при дубликатах ключей побеждает последний (поведение Object.fromEntries)', () => {
    const headers = [
      { id: '1', key: 'X-Id', value: '111' },
      { id: '2', key: 'X-Id', value: '222' },
    ];
    expect(headersArrayToObj(headers)).toEqual({ 'X-Id': '222' });
  });

  it('возвращает пустой объект для пустого массива', () => {
    expect(headersArrayToObj([])).toEqual({});
  });

  it('допускает пустые значения (value может быть пустой строкой)', () => {
    const headers = [{ id: '1', key: 'X-Empty', value: '' }];
    expect(headersArrayToObj(headers)).toEqual({ 'X-Empty': '' });
  });
});
