import { isRequestRecord } from '@/lib/utils/is-request-record';

const createValidRecord = () => ({
  id: '1',
  uid: 'user-1',
  endpoint: '/api',
  method: 'GET',
  status: 200,
  latencyMs: 123,
  reqBytes: 1024,
  resBytes: 2048,
  error: null,
  time: 1700000000000,
  restore: {
    url: 'https://example.com',
    method: 'POST',
    body: '{"foo":"bar"}',
    headers: [{ id: 'h1', key: 'Accept', value: 'application/json' }],
  },
});

describe('isRequestRecord', () => {
  it('returns true for a valid record', () => {
    const record = createValidRecord();

    expect(isRequestRecord(record)).toBe(true);
  });

  it('returns false for non-object values', () => {
    expect(isRequestRecord(null)).toBe(false);
    expect(isRequestRecord('string')).toBe(false);
  });

  it('returns false when required fields missing', () => {
    const record = createValidRecord();
    const { id: _removed, ...withoutId } = record;

    expect(isRequestRecord(withoutId)).toBe(false);
  });

  it('returns false when numeric fields invalid', () => {
    const record = createValidRecord();
    const invalidRecord = { ...record, reqBytes: Number.NaN };

    expect(isRequestRecord(invalidRecord)).toBe(false);
  });

  it('returns false when restore is invalid', () => {
    const record = createValidRecord();
    const invalidRestoreRecord = {
      ...record,
      restore: { ...record.restore, headers: 'invalid' },
    };

    expect(isRequestRecord(invalidRestoreRecord)).toBe(false);
  });
});
