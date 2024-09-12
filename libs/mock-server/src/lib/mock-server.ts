import * as fs from 'fs';
import * as path from 'path';
import Response from './response';
import errors from './error';

class MockServer {
  config: any;
  app: any;
  allEndpoints: string[];
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

  ensureNoSlashEnd(path) {
    return path.substr(path.length - 1, 1) === '/'
      ? path.substr(0, path.length - 1)
      : `${path}`;
  }
  ensureNoSlashStart(path) {
    return path.substr(0, 1) === '/'
      ? path.substr(1, path.length - 1)
      : `${path}`;
  }

  makePath(
    dir,
    parentPath = this.config.staticApiPath,
    _arrPaths: string[] = [],
    processPath = ''
  ) {
    const arrPaths: string[] = _arrPaths;
    const thisPath = path.join(parentPath, dir);
    const pathProcessed = parentPath
      ? fs.statSync(thisPath).isDirectory() &&
        !fs.existsSync(path.join(thisPath, 'index.js'))
        ? path.join(processPath, dir)
        : processPath
      : dir;
    if (fs.statSync(thisPath).isDirectory()) {
      const result = fs.readdirSync(thisPath);
      if (result.length > 0) {
        result.map((childPath) => {
          this.makePath(childPath, thisPath, arrPaths, pathProcessed);
        });
      }
    } else {
      if (arrPaths.indexOf(pathProcessed) === -1) {
        arrPaths.push(pathProcessed);
        console.log(`created:${pathProcessed}`);
      }
    }
    return arrPaths;
  }

  async getAllUrls() {
    const result = fs.readdirSync(this.config.staticApiPath);
    this.allEndpoints = result.map((path) => this.makePath(path)).flat();
  }

  getFinalPath(url) {
    const index = this.allEndpoints.indexOf(url);
    let matchedItem = '';
    const params = {
      url,
    };
    if (index === -1) {
      this.allEndpoints.forEach((item) => {
        let hasMatch = true;
        const leftSide = item.split(path.sep);
        const rightSide = url.split('/');
        leftSide.forEach((item, idx) => {
          if (hasMatch && item.match(new RegExp('\\[(.*)\\]'))) {
            params[item.match(new RegExp('\\[(.*)\\]'))[1]] = rightSide[idx];
          } else if (hasMatch) {
            hasMatch = item === rightSide[idx];
          }
        });
        if (hasMatch) {
          matchedItem = item;
        }
      });
    }
    if (matchedItem) {
      return {
        path: path.resolve(
          this.ensureNoSlashEnd(this.config.staticApiPath),
          matchedItem
        ),
        params,
      };
    }
    return {
      path: path.resolve(this.ensureNoSlashEnd(this.config.staticApiPath), url),
      params,
    };
  }

  init() {
    console.log('--- init mock-server');
    this.getAllUrls();
    this.app.all(this.config.staticMocks, (req, res) => {
      const reqPath = req._parsedUrl.pathname;
      const method = req.method.toLowerCase();
      const urlToServe = this.ensureNoSlashStart(reqPath);

      if (!urlToServe) {
        return res.status(200).send({
          endpoints: this.allEndpoints,
        });
      }
      // console.log(reqPath);
      console.log(`[${method}]=${urlToServe}`);
      const returnObj = this.getFinalPath(urlToServe);
      let finalPath = returnObj.path;
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
      console.log(
        `serving:[${method}]"${path.relative(
          this.config.staticApiPath,
          finalPath
        )}"`
      );
      try {
        if (isJs) {
          console.log(`executing dynamic route`);
          response = require(finalPath);
        } else {
          if (fs.existsSync(finalPath)) {
            response = this.fse.readFileSync(finalPath, 'utf8');
            response = JSON.parse(response);
          } else {
            throw `${urlToServe} not found`;
          }
        }
        if (typeof response === 'function') {
          response = response(req, res, returnObj);
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
