const baseFolder = process.cwd();
const fs = require('fs');
const path = require('path');
const recursive = require('fs-readdir-recursive');
const tlog = require(path.join(baseFolder, 'src/lib/logger'));

const { ESLint } = require('eslint');

const sourceFolder = path.join(baseFolder, 'src/js/');
const stats = { error: 0, warning: 0 };

async function lint(callback) {
  const eslint = new ESLint();

  const files = recursive(sourceFolder).filter(f => f.endsWith('.js'));

  for (const f of files) {
    const filePath = path.join(sourceFolder, f);
    tlog.info('^B%s^R', f);

    const results = await eslint.lintFiles([filePath]);

    results.forEach(result => {
      result.messages.forEach(m => {
        if (m.fatal || m.severity === 2) {
          stats.error++;
          tlog.error('   ^RError^: %s ^R(^Y%s^w:^Y%s^R)', m.message, m.line, m.column);
        } else {
          stats.warning++;
          tlog.warn('   ^YWarning^: %s ^R(^Y%s^w:^Y%s^R)', m.message, m.line, m.column);
        }
      });
      if (result.messages.length === 0) tlog.info('   ^G\u2713^: OK');
    });
    tlog.br();
  }

  tlog.info('Linting completed ^G-^: Errors ^R%s^: ^G-^: Warnings ^Y%s^:\n\n', stats.error, stats.warning);
  // process.exit(stats.error);
  if (callback) callback(stats);
}

module.exports = { lint };
