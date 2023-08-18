# @ashvajs/mock-server

## Description
Simple mock server to serve static/dynamic routes for mock api.


## Usage

Create your mock server object with mock server class and pass express app object with folder path.

```
import path from 'path';
import express from 'express';
import { MockServer } from '@ashvajs/mock-server';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();
const mockserver = new MockServer(
  {
    staticApiPath: path.resolve('apps/mock-server-example/mocks'),
  },
  app
);
mockserver.init();

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

```


## Examples
see `apps/mock-server-example`