 /**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const path = require('../fastpath');
const fs = require('fs');

const NODE_MODULES = path.sep + 'node_modules' + path.sep;

class DependencyGraphHelpers {
  constructor({ providesModuleNodeModules, assetExts }) {
    this._providesModuleNodeModules = providesModuleNodeModules;
    this._assetExts = assetExts;
  }

  isNodeModulesDir(file) {
    const index = file.lastIndexOf(NODE_MODULES);
    if (index === -1) {
      return false;
    }

    const parts = file.substr(index + 14).split(path.sep);
    const dirs = this._providesModuleNodeModules;
    for (let i = 0; i < dirs.length; i++) {
      if (parts.indexOf(dirs[i]) > -1) {
        return false;
      }
    }

    return true;
  }

  isProvidesModuleNodeModulesDir(file) {
    const index = file.lastIndexOf(NODE_MODULES);
    if (index === -1) {
      return false;
    }

    const parts = file.substr(index + 14).split(path.sep);
    const dirs = this._providesModuleNodeModules;
    for (let i = 0; i < dirs.length; i++) {
      if (parts.indexOf(dirs[i]) > -1) {
        return true;
      }
    }

    return false;
  }

  isProvidesModuleDir(file) {
    const index = file.lastIndexOf(NODE_MODULES);
    if (index !== -1) {
      return false;
    }

    const parts = file.split(path.sep);
    if (parts[0] === '') {
      parts[0] = path.sep;
    }
    const dirs = this._providesModuleNodeModules;
    for (let i = 0; i < dirs.length; i++) {
      const index = parts.indexOf(dirs[i]);
      if (index > -1) {
        const packageJsonFile = path.join(path.join.apply(null, parts.slice(0, index + 1)), 'package.json');
        if (fs.existsSync(packageJsonFile)) {
          return true;
        }
      }
    }

    return false;
  }

  isAssetFile(file) {
    return this._assetExts.indexOf(this.extname(file)) !== -1;
  }

  extname(name) {
    return path.extname(name).substr(1);
  }
}

module.exports = DependencyGraphHelpers;
