# ~~Lost~~ and Found
> Pin your lost and found items in the UCSC campus map!

[![Build Status](https://travis-ci.org/VVNoodle/LoFo.svg?branch=BACKUP-MASTER)](https://travis-ci.org/VVNoodle/LoFo) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/VVNoodle/LoFo/blob/BACKUP-MASTER/LICENSE)

The idea began with the abundance of lost/found posts in the official UCSC Facebook page. In order to organize these posts and lessen the cluttering, we wanted to create something that can compile all these items onto a map. This will not only provide what Facebook already supported, but also generate a visual interface to locate items lost and items found.

![Cite Homepage](https://i.imgur.com/b0WYjKG.png "Cite Homepage")

# Table of content
- [Getting Started](#getting-started)
  * [Installation](#installation)
- [Development Setup](#development-setup)
  * [Running the tests](#running-the-tests)
  * [Deployment](#deployment)
- [Built With](#built-with)
- [Contributing](#contributing)
- [Authors](#authors)

# Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation
1. Install Node.js
2. In your preferred directory, clone this repository
3. Install dependencies via NPM:
```
npm install --only=production
```
4. create a `dev.env.js` file in the `config` folder, and fill in the following:
```javascript
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_KEY: '"YOUR FIREBASE API KEY"',
  AUTH_DOMAIN: '"YOUR FIREBASE PROJECT DOMAIN"',
  DB_URL: '"YOUR FIREBASE DB URL"',
  PROJECT_ID: '"YOUR FIREBASE PROJECT ID"',
  STORAGE_BUCKET: '"YOUR FIREBASE STORAGE BUCKET"',
  MESSAGING_SENDER_ID: '"YOUR MESSAGIN SENDER ID"',
})
```
These environment variables are used to initialize firebase in `src/firebase/init.js`. Thefore, you need to create your own firebase project at [firebase console](https://console.firebase.google.com). To build for production, you can also add `prod.env.js` in `config` and fill in the following: 
```javascript
'use strict'

module.exports = {
  NODE_ENV: '"production"',
  API_KEY: '"YOUR FIREBASE API KEY"',
  AUTH_DOMAIN: '"YOUR FIREBASE PROJECT DOMAIN"',
  DB_URL: '"YOUR FIREBASE DB URL"',
  PROJECT_ID: '"YOUR FIREBASE PROJECT ID"',
  STORAGE_BUCKET: '"YOUR FIREBASE STORAGE BUCKET"',
  MESSAGING_SENDER_ID: '"YOUR MESSAGIN SENDER ID"',
}
```
5. Run the application locally (hosted at localhost:8080):
```
npm start
```

# Development Setup
Install all dependecies (including dev dependencies) via NPM:
```
npm install
```
## Running the tests
tests can be found in the `test` folder. We chose `Mocha` as our testing framework, and `Karma` as test runner. Run the automated test by doing:
```
npm install
npm run unit
```

# Built With
* [Vue.js](https://vuejs.org) - Progressive JavaScript Framework
* [Firestore](https://firebase.google.com/docs/firestore/) - Realtime Database
* [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial) - Maps API

# Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us (Doc will be written soon).

# Authors
* Geoff Huang
* Lily Nguyen
* Chengyu Jiang
* Wan Fong
* Egan Bisma
* Peter Eskraus
