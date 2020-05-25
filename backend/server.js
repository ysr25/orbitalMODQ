const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3001;
const server = http.createServer(app);

console.log(`Listening on port: ${port}`);
server.listen(port);

module.exports = server;