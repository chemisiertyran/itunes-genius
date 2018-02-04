/**
 * itunes-genius
 *
 * Copyright © 2016 . All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Greeting from './Greeting.js';
import http from 'http';

let g = new Greeting();
console.log(g.hello());

const ITUNES_NOW_PLAYING_URL = "http://localhost:8181/now_playing";

http.get(ITUNES_NOW_PLAYING_URL, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      // console.log(parsedData);

      if (parsedData.artist && parsedData.name && parsedData.album) {
        console.log("Currently playing: " + parsedData.artist + " - " + parsedData.name + " from " + parsedData.album);
      }

    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
