#!/bin/bash
find . -name "*.js" -type f|xargs rm -f
find . -name "*.map" -type f|xargs rm -f

npm uninstall koa koa-send koa-router koa-static
