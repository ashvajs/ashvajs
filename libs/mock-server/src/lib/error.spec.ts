import error from './error';

describe('MockServer', () => {
  let mockServer;

  it('should create given endpoints', () => {
    expect(error.notfound()).toEqual({
      code: 404,
      key: 'NOT_FOUND',
      message: 'not found',
    });
  });
});
