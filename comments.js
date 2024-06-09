// Create web server
// 1. Import modules
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const qs = require('querystring');
// 2. Create server
const server = http.createServer((req, res) => {
  const method = req.method;
  const urlParsed = url.parse(req.url, true);
  const pathname = urlParsed.pathname;
  const query = urlParsed.query;
  const headers = req.headers;
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    if (method === 'GET' && pathname === '/comments') {
      fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Internal server error' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    } else if (method === 'POST' && pathname === '/comments') {
      const newComment = qs.parse(body);
      fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Internal server error' }));
          return;
        }
        const comments = JSON.parse(data);
        comments.push(newComment);
        fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), (err) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
            return;
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newComment));
        });
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not found' }));
    }
  });
});
// 3. Start server
server.listen(3000, () => {
  console.log('Server is running at http://localhost: 3000'); });