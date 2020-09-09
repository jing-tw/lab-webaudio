
'use strict';
import * as Koa from "koa";
import * as send from 'koa-send';
import * as Router from "koa-router";
import * as serve from 'koa-static';
declare var __dirname;

let app = new Koa();
let router = new Router();

// serve files in public folder (css, js etc)
app.use(serve(__dirname + '/public'));  // http://localhost:3000/index.html

// rest endpoints
router.get('/api/whatever', function *(){
  this.body = 'hi from get';
});


router.post('/api/whatever', function *(){
  this.body = 'hi from post'
});

app.use(router.routes());

// // this last middleware catches any request that isn't handled by
// // koa-static or koa-router, ie your index.html in your example
// app.use(function* index() {
//   yield send(this, '/error.html');
// });

console.log('Starting up http-server, serving ./public/');
console.log('Available on:');
console.log('\thttp://localhost:3000\n\n');
console.log('Hit CTRL-C to stop the server');
app.listen(3000);