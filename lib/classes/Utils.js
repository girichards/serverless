'use strict';

const path = require('path');
const YAML = require('js-yaml');
const BbPromise = require('bluebird');
const fse = BbPromise.promisifyAll(require('fs-extra'));

class Utils {

  constructor(S) {
    this.S = S;
  }

  dirExistsSync(dirPath) {
    try {
      const stats = fse.statSync(dirPath);
      return stats.isDirectory();
    } catch (e) {
      return false;
    }
  }

  fileExistsSync(filePath) {
    try {
      const stats = fse.lstatSync(filePath);
      return stats.isFile();
    } catch (e) {
      return false;
    }
  }

  writeFileSync(filePath, conts) {
    let contents = conts || '';

    fse.mkdirsSync(path.dirname(filePath));

    if (filePath.indexOf('.json') !== -1 && typeof contents !== 'string') {
      contents = JSON.stringify(contents, null, 2);
    }

    if (filePath.indexOf('.yaml') !== -1 && typeof contents !== 'string') {
      contents = YAML.dump(contents);
    }

    return fse.writeFileSync(filePath, contents);
  }

  writeFile(filePath, contents) {
    const that = this;
    return new BbPromise((resolve, reject) => {
      try {
        that.writeFileSync(filePath, contents);
      } catch (e) {
        reject(e);
      }
      resolve();
    });
  }

  readFileSync(filePath) {
    let contents;

    // Read file
    contents = fse.readFileSync(filePath);

    // Auto-parse JSON
    if (filePath.endsWith('.json')) contents = JSON.parse(contents);

    return contents;
  }

  readFile(filePath) {
    const that = this;
    let contents;
    return new BbPromise((resolve, reject) => {
      try {
        contents = that.readFileSync(filePath);
      } catch (e) {
        reject(e);
      }
      resolve(contents);
    });
  }

  generateShortId(length) {
    return Math.random().toString(36).substr(2, length);
  }

}

module.exports = Utils;