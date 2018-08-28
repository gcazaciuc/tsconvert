#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const convert = require('../src/index');

convert(argv);
