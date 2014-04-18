#!/bin/bash

FOREVER=./node_modules/.bin/forever

make browserify

if [ $NODE_ENV == local ];then
  sails lift
else
  $FOREVER start --minUptime 1000 --spinSleepTime 1000 app.js --prod
fi
