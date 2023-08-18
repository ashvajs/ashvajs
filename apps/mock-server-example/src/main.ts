import express from 'express';
import path from 'path';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
import { MockServer } from '@ashvajs/mock-server';
const app = express();
const mockserver = new MockServer(
  {
    staticApiPath: path.resolve('apps/mock-server-example/mocks'),
  },
  app
);
mockserver.init();

app.get('/', (req, res) => {
  res.send({ message: 'Try using /api/v1/test' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
