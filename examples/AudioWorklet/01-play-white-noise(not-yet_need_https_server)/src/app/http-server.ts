'use strict';
import Koa from "koa";
import serve from 'koa-static';
import https from 'https';


const app = new Koa();
app.use(serve('.'));

// app.use(async ctx => {
//   ctx.body = 'Hello World';
// });



const HOST = 'localhost';
const HTTPS_PORT = 3001

const httpsServer = https.createServer(app.callback())
    .listen(HTTPS_PORT, HOST, listeningReporter)

// A function that runs in the context of the http server
// and reports what type of server listens on which port
function listeningReporter () {
    console.log('Starting up http-server, serving ./app/');
    console.log('Available on:');
    console.log('\thttps://localhost:3001\n\n');
    console.log('Hit CTRL-C to stop the server');
}