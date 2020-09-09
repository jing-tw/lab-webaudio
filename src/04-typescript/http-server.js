// Install:
//  sudo n 9    
//  npm i koa
//
// Usage:
//  node http-server.js   // start the server
//  gio open http://localhost:3000/    // open the browswer

// const Koa = require('koa');
// const fs = require('fs');
// var route = require('koa-route');

// const app = new Koa();



// app.use(route.get('/', index));
// // app.use(async ctx => {
// //   ctx.type = 'html';
// //   ctx.body = fs.createReadStream('index.html');
// // });

// function *index() {
//   this.body = "<h1>Hello! This is my home page!</h1>";
// }


// console.log('Starting up http-server, serving ./');
// console.log('Available on:');
// console.log('\thttp://localhost:3000');
// console.log('Hit CTRL-C to stop the server');
// app.listen(3000);

'use strict';
let koa     = require('koa'),
    send    = require('koa-send'),
    router  = require('koa-router')(),
    serve   = require('koa-static');

let app = new koa();
// serve files in public folder (css, js etc)
app.use(serve(__dirname + '/public'));  // http://localhost:3000/client.html

// rest endpoints
router.get('/api/whatever', function *(){
  this.body = 'hi from get';
});
router.post('/api/whatever', function *(){
  this.body = 'hi from post'
});

app.use(router.routes());

// this last middleware catches any request that isn't handled by
// koa-static or koa-router, ie your index.html in your example
app.use(function* index() {
  yield send(this, '/index.html');
});

app.listen(3000);