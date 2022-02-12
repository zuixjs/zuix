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

'use strict';

const jobsList = [];
let currentIndex = -1;
let listener = null;
let lazyThread = null;

function AsynChain(callback) {
  listener = callback;
}

AsynChain.prototype.append = function(list) {
  let exists;
  zuix.$.each(list, (i, newJob) => {
    exists = false;
    for (let j = 0; j < jobsList.length; j++) {
      const job = jobsList[j];
      if (job.item.element === newJob.item.element) {
        exists = true;
        jobsList[j] = newJob;
        break;
      }
    }
    if (!exists) {
      jobsList.push(newJob);
    }
  });
  if (jobsList.length > 0 && currentIndex === -1) {
    listener.status('start', jobsList);
    next();
  }
};

// --------------------------------------------

function next() {
  resetAsynCallback();
  currentIndex++;
  if (currentIndex < jobsList.length && !listener.willBreak()) {
    worker();
    return true;
  }
  if (currentIndex >= jobsList.length || listener.willBreak()) {
    done();
  }
  return false;
}
function done(reason) {
  currentIndex = -1;
  listener.status(reason != null ? reason : 'done');
}

function worker() {
  const job = jobsList[currentIndex];
  if (job == null) {
    return false;
  }
  const doWork = function() {
    resetAsynCallback();
    if (!listener.doWork(job.item, function() {
      lazyThread = setTimeout(next);
    })) {
      next();
    }
  };
  if (job.cancelable) {
    if (listener.willBreak()) {
      done('stopped');
    } else if (lazyThread == null) {
      lazyThread = setTimeout(doWork);
    } else {
      return false;
    }
  } else {
    doWork();
  }
  return true;
}

function resetAsynCallback() {
  if (lazyThread !== null) {
    clearTimeout(lazyThread);
    lazyThread = null;
  }
}

module.exports = function(callback) {
  return new AsynChain(callback);
};
