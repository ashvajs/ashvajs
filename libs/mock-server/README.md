# @ashvajs/mock-server

[![npm](https://img.shields.io/npm/dm/@ashvajs/mock-server.svg)](https://www.npmjs.com/package/@ashvajs/mock-server)
[![npm](https://img.shields.io/npm/v/@ashvajs/mock-server.svg)](https://www.npmjs.com/package/@ashvajs/mock-server)

## Description
Simple mock server to serve static/dynamic routes for mock api.


## Usage

Create your mock server object with mock server class and pass express app object with folder path.

## Folder structure
```
mocks
..api
....v1
......product
........[product] // serves /api/v1/product/[apple|etc|string]/list-items
.........list-items
............get.json // serves /api/v1/product/[apple|etc|string]/list-items [get method]
.........post.json // serves /api/v1/product/[apple|etc|string] [post method]
......test // route
........post.json // serves as /api/v1/test [post method]
........get.json // serves as /api/v1/test [get method]
........delete.json // serves as /api/v1/test [delete method]
........patch.json // serves as /api/v1/test [patch method]
......dynamic // route
........post // for dynamic routes
..........index.js 
........get
..........index.js
```

# Dynamic route example

## dynamic/post/index.js
```

module.exports = (req, res, options) => {
  // options.params to access url parameters
  // e.g. route is /api/v1/product/[productid]
  // if call is done for /api/v1/product/prod-149 
  // options.params.productid -> prod-149
  //write your business logic
  return {
    message: 'js response example',
  };
};

```

## Example

## ES6
```
import path from 'path';
import express from 'express';
import { MockServer } from '@ashvajs/mock-server';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();
const mockserver = new MockServer(
  {
    staticMocks: '/api/*', // or *|custom pattern
    staticApiPath: path.resolve('apps/mock-server-example/mocks'),
  },
  app
);
mockserver.init();

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

```

## Javascript
```
const path = require('path');
const express = require('express');
const { MockServer } = require('@ashvajs/mock-server');
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();
const mockserver = new MockServer(
  {
    staticMocks: '/api/*', // or *|custom pattern
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