/*
 * Copyright 2017 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const _gulp = require('gulp');
const help = require('gulp-help');
const mocha = require('gulp-mocha');
const execa = require('execa');
const path = require('path');
const del = require('del');

const gulp = help(_gulp);

const healthCheckDir = __dirname;
const baseDir = path.resolve(healthCheckDir, '..', '..');
const testDir = path.resolve(healthCheckDir, 'test');

gulp.task('health-check.clean.links', 'Delete npm links', () => {
  return del(path.resolve(healthCheckDir, 'node_modules/grpc'));
});

gulp.task('health-check.clean.all', 'Delete all code created by tasks',
	  ['health-check.clean.links']);

gulp.task('health-check.install', 'Install health check dependencies', () => {
  return execa('npm', ['install', '--unsafe-perm'], {cwd: healthCheckDir, stdio: 'inherit'});
});

gulp.task('health-check.link.add', 'Link local copy of grpc', ['health-check.install'], () => {
  return execa('npm', ['link', 'grpc'], {cwd: healthCheckDir, stdio: 'inherit'});
});

gulp.task('health-check.test', 'Run health check tests',
          () => {
            return gulp.src(`${testDir}/*.js`).pipe(mocha({reporter: 'mocha-jenkins-reporter'}));
          });
