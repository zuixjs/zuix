/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

// Commons
const fs = require('fs');
const path = require('path');
const baseFolder = process.cwd();
const distFolder = path.join(baseFolder, 'dist');
// logging
const tlog = require(path.join(baseFolder, 'src/lib/logger'));

const webpack = require('webpack');

function build(configFile, callback) {
  const config = require(path.join(baseFolder, configFile));
  const compiler = webpack(config);

  // `compiler.run()` doesn't support promises yet, only callbacks
  new Promise((resolve, reject) => {
    compiler.run((err, res) => {
      if (err) {
        return reject(err);
      }
      resolve(res);
    });
  }).then((res) => {
    if (res.compilation && res.compilation.errors && res.compilation.errors.length > 0) {
      console.log(res.compilation.errors, 'ERROR');
      callback(-1);
    } else {
      callback(0);
    }
  });
}

module.exports = {
  build: build
};
