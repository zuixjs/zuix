/**
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
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

/**
 *
 *  This file is part of
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

function ThreadPool(callback) {
    listener = callback;
}
ThreadPool.prototype.break = function () {
    breakJobs = true;
    if (activePools == 0) // TODO: this shouldn't be less than zero
        done();
};
ThreadPool.prototype.isReady = function () {
    return jobsList.length == 0;
};
ThreadPool.prototype.setJobs = function(list) {
    // TODO: stops any pending job
    if (jobsList.length > 0)
        alert('ThreadPool warning, should not set a new job list if still working.');
    jobsList = list;
    listener.status('start', jobsList);
    run();
};

// --------------------------------------------

var jobsList = [];
var currentIndex = 0;
var breakJobs = false;
var listener = null;

var poolSize = 10;
var activePools = 0;
var stopping = false;

function run() {
    //var loadNext = throttle(next, 1);
    for (var i = 0; i < (poolSize - activePools); i++) {
        if (!next())
            break;
    }
}

function next() {
    currentIndex++;
    if (currentIndex < jobsList.length)
        return runOne();
    //else done();
    return false;
}
function done() {
    breakJobs = false;
    stopping = false;
    activePools = 0;
    currentIndex = -1;
    jobsList.length = 0;
    jobsList = [];
    listener.status('done');
}

function waitComplete() {
    stopping = true;
    if (activePools > 0)
        setTimeout(function () {
            waitComplete();
        }, 2000);
    else {
        stopping = false;
        //done();
    }
}

function runOne() {
    if (stopping) return false;
    if (breakJobs) {
        waitComplete();
        breakJobs = false;
        if (currentIndex < jobsList.length) {
            //breakJobs = false;
            listener.status('stopped', { remaining: jobsList.length-currentIndex-1, jobs: jobsList.splice(0, currentIndex+1)});
        }
        return false;
    }
    var job = jobsList[currentIndex];
    if (job == null) return false;
    var doWork = function () {
        activePools++;
        if (!listener.doWork(job.item, function () {
                // wrapping with request animation frame is needed for "break" to work
                activePools--;
                if (currentIndex == -1 || currentIndex >= jobsList.length - 1)
                    done();
                else requestAnimationFrame(next);
            })) { activePools--; next(); };
    };
    if (job.cancelable) {
        requestAnimationFrame(doWork);
    } else doWork();
    return true;
}

function throttle(fn, wait) {
    var time = Date.now();
    return function() {
        if ((time + wait - Date.now()) < 0) {
            fn();
            time = Date.now();
        }
    }
}

module.exports = function (callback) {
    return new ThreadPool(callback);
};