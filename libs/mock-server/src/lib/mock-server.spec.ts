import path = require('path');
import { MockServer } from './mock-server';

describe('MockServer', () => {
  let mockServer;
  beforeEach(() => {
    mockServer = new MockServer(
      {
        staticApiPath: path.resolve('libs/mock-server/tests/mock-routes'),
      },
      {
        all: jest.fn(),
      }
    );
    mockServer.init();
  });
  it('should create given endpoints', () => {
    expect(mockServer.allEndpoints).toEqual([
      'api/v1/dynamic',
      'api/v1/static/product',
      'api/v1/todo/[title]',
    ]);
  });
});
