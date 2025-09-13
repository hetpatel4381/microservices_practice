const http = require('http');

const app = require('./app');

const server = http.createServer(app);

server.listen(3001, () => {
    console.log('User Service is running on http://localhost:3001');
});