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

const term = require('terminal-kit').terminal;
const util = require('util');
const stats = {
    info: 0,
    error: 0,
    warn: 0
};
term.reset().clear();

function update(s, ...args) {
    term.restoreCursor(util.format(s, ...args)).eraseLineAfter('\n');
    return this;
}

function overwrite(s, ...args) {
    term.eraseLine().previousLine();
    if (s != null) {
        info(s, ...args);
    }
    return this;
}

function br(s, ...args) {
    if (s == null) s = '';
    term.bgDefaultColor('\n').defaultColor('             ^#^k^W|^: ').saveCursor(util.format(s, ...args));
    return this;
}

function info(s, ...args) {
    if (s == null) s = '';
    t().bgBrightGreen().black('I')
        .bgDefaultColor().defaultColor(' ').saveCursor(util.format(s, ...args));
    stats.info++;
    return this;
}

function warn(s, ...args) {
    if (s == null) s = '';
    t().bgYellow().black('W')
        .bgDefaultColor().defaultColor(' ').saveCursor(util.format(s, ...args));
    stats.warn++;
    return this;
}

function error(s, ...args) {
    if (s == null) s = '';
    t().bgBrightRed().white('E')
        .bgDefaultColor().defaultColor(' ').saveCursor(util.format(s, ...args));
    stats.error++;
    return this;
}

function t() {
    return term.bgDefaultColor('\n').white(timestamp()+' ');
}

function timestamp() {
    const d = new Date();
    const ms = d.getTime() - d.getTimezoneOffset() * 60000;
    return new Date(ms).toISOString().slice(11, -1);
}

const busyCursorAnim = ['|', '/', '-', '\\', '/', '-'];
let busyCursorFrame = 0;
function busyCursor() {
    if (busyCursorFrame > busyCursorAnim.length-1) {
        busyCursorFrame = 0;
    }
    return busyCursorAnim[busyCursorFrame++];
}

module.exports = {
    info: info,
    error: error,
    warn: warn,
    update: update,
    overwrite: overwrite,
    br: br,
    stats: function() {
        return stats;
    },
    busyCursor: busyCursor,
    timestamp: timestamp,
    term: term
};
