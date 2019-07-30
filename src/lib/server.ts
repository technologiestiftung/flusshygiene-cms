import { NODE_ENV } from './config';
import browserSync from 'browser-sync';
import http from 'http';
// import { OPEN } from 'ws';
// import WebSocket from 'ws';
import {auth} from './auth';
import app from './app';
// import {WS} from './websocket';
const ENV_SUFFIX = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';
const PORT = process.env[`FRONTEND_EXPRESS_PORT_${ENV_SUFFIX}`] || 3004;
// const log = devlogGen(PORT);

app.locals.val = 0;

auth().then((token)=>{
  app.locals.token = token;
  // console.log(app.locals.token);
}).catch((err)=>{
  if(NODE_ENV === 'development'){
    console.error(err);
  }else{
    throw err;
  }
}).finally(()=>{
  console.log('auth done');
});

const server = http.createServer(app);
// const wsserver = WS.getInstance(server);
// wsserver.on('connection', () => {
//   process.stdout.write(`somebody connected\n`);

// });

// WS.emitter.on('messages', (message) => {
//   process.stdout.write(`event emitter, ${message}\n`);
// });

server.listen(PORT);

server.on('listening', () => {
  if(process.env.NODE_ENV === 'development'){

    browserSync({
      files: ['../../public/assets/css/**/*.{css}'],
      open: false,
      proxy: `localhost:${PORT}`,
    });
    process.stdout.write(`listening on http://localhost:${PORT}`);
  }
  // setInterval(() => {
  //   WS.emitter.emit('send', 'sending data outside of wsserver');
  // }, 1000);
});
