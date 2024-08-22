import * as fs from 'fs';
import * as path from 'path';
import Response from './response';
import errors from './error';

class MockServer {
  config: any;
  app: any;
  fse: any;

  constructor({ fse = fs, ...options }: any = {}, app) {
    this.config = {
      staticMocks: '/api/*',
      staticApiPath: './mocks',
      plainResponse: false,
      ...options,
    };
    this.app = app;
    this.fse = fse;
  }

  ensureNoSlash(path) {
    return path.substr(path.length - 1, 1) === '/'
      ? path.substr(0, path.length - 1)
      : `${path}`;
  }

  init() {
    console.log('--- init mock-server');
    this.app.all(this.config.staticMocks, (req, res) => {
      const reqPath = req._parsedUrl.pathname;
      const method = req.method.toLowerCase();
      let finalPath = reqPath.resolve(
        this.ensureNoSlash(this.config.staticApiPath),
        reqPath
      );
      // console.log(finalPath);
      let response: any = new Response(errors.notfound()).error();
      let isJs = false;
      if (this.fse.existsSync(path.join(finalPath, method, 'index.js'))) {
        finalPath = path.join(finalPath, method, 'index.js');
        isJs = true;
      } else if (this.fse.existsSync(path.join(finalPath, `${method}.json`))) {
        finalPath = path.join(finalPath, `${method}.json`);
      } else if (this.fse.existsSync(path.join(finalPath, `index.json`))) {
        finalPath = path.join(finalPath, `index.json`);
      }
      console.log(`mock serving_path=${finalPath}`);
      try {
        if (isJs) {
          console.log(`executing dynamic route`);
          response = require(finalPath);
        } else {
          response = this.fse.readFileSync(finalPath, 'utf8');
          response = JSON.parse(response);
        }
        if (typeof response === 'function') {
          response = response(req, res);
        }
      } catch (ex) {
        console.log(ex);
      }

      // const method = req.method.toLowerCase();
      // const routerData = apis[routerName];
      // const status = apis[routerName].status || 200;

      return res.status(response.statusCode || 200).send(response);
    });
  }
}
export { MockServer };
