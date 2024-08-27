import path from 'path';
import express from 'express';
import { MockServer } from '@ashvajs/mock-server';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();
const mockserver = new MockServer(
  {
    staticMocks: '*',
    staticApiPath: path.resolve('apps/mock-server-example/mocks'),
  },
  app
);
mockserver.init();

app.get('/', (req, res) => {
  res.send({ message: 'Try using ', endpoints: mockserver?.allEndpoints });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
