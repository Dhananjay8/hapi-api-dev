'use strict';

const Hapi = require('hapi');
const mongoose = require('mongoose');

// ES6 Promises
mongoose.Promise = global.Promise;

const dbuser = 'dhananjay97',
  dbpassword = '#Dhananjay97';


// Connect to mongodb
mongoose.connect('mongodb://'+dbuser+':'+dbpassword+'@ds151382.mlab.com:51382/hapi_dev');
mongoose.connection.once('open', function(){
  console.log('Connection has been made, now make fireworks...');
  done();
}).on('error', function(error){
  console.log('Connection error:', error);
});

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    
    return 'Hello, world!';
  }
});

server.route({
  method: 'GET',
  path: '/{name}',
  handler: (request, h) => {
    
    // request.log(['a', 'name'], "Request name");
    // or
    request.logger.info('In handler %s', request.path);
    
    return `Hello, ${encodeURIComponent(request.params.name)}!`;
  }
});

const init = async () => {
  
  await server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: false,
      logEvents: ['response']
    }
  });
  
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  
  console.log(err);
  process.exit(1);
});

init();

/*
Now when the server is started you'll see something like:
  
  [2017-12-03T17:15:45.114Z] INFO (10412 on box): server started
created: 1512321345014
started: 1512321345092
host: "localhost"
port: 3000
protocol: "http"
id: "box:10412:jar12y2e"
uri: "http://localhost:3000"
address: "127.0.0.1"
*/