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
 * @author Generoso Martello  -  https://github.com/genemars
 */

const baseFolder = process.cwd();
// Commons
const fs = require('fs');
const path = require('path');
const recursive = require('fs-readdir-recursive');
// logging
const tlog = require(path.join(baseFolder, 'src/lib/logger'));
// ESLint
const Linter = require('eslint').Linter;
const linter = new Linter();
const lintConfig = require(path.join(baseFolder, '.eslintrc.json'));

const sourceFolder = path.join(baseFolder, 'src/js/');
const stats = {
  error: 0,
  warning: 0
};

function lint(callback) {
  recursive(sourceFolder).map((f, i) => {
    if (f.endsWith('.js')) {
      tlog.info('^B%s^R', f);
      const code = fs.readFileSync(sourceFolder + f, 'utf8');
      const issues = linter.verify(code, lintConfig, sourceFolder + f);
      issues.map((m, i)=>{
        if (m.fatal || m.severity > 1) {
          stats.error++;
          tlog.error('   ^RError^: %s ^R(^Y%s^w:^Y%s^R)', m.message, m.line, m.column);
        } else {
          stats.warning++;
          tlog.warn('   ^YWarning^: %s ^R(^Y%s^w:^Y%s^R)', m.message, m.line, m.column);
        }
      });
      if (issues.length === 0) tlog.info('   ^G\u2713^: OK');
      tlog.br();
    }
  });
  tlog.info('Linting completed ^G-^: Errors ^R%s^: ^G-^: Warnings ^Y%s^:\n\n', stats.error, stats.warning);
  // process.exit(stats.error);
  if (callback) callback(stats);
}

module.exports = {
  lint: lint
};
