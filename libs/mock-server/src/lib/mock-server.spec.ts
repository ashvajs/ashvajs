import { MockServer } from './mock-server';

describe('MockServer', () => {
  it('should work', () => {
    expect(new MockServer({}, {})).toBeDefined();
  });
});
