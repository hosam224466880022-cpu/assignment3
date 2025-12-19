const http = require('http');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'users.json');

// Read users from file
function readUsers() {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Write users to file
function writeUsers(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const { method, url } = req;

  // ========= GET ALL USERS =========
  if (method === 'GET' && (url === '/user' || url === '/user/')) {
    const users = readUsers();
    return res.end(JSON.stringify(users));
  }

  // ========= GET USER BY ID =========
  if (method === 'GET' && url.startsWith('/user/')) {
    const id = url.split('/')[2];
    const users = readUsers();
    const user = users.find(u => u.id === id);

    return res.end(
      JSON.stringify(user || { message: 'User not found' })
    );
  }

  // ========= ADD USER =========
  if (method === 'POST' && (url === '/user' || url === '/user/')) {
    let body = '';

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const newUser = JSON.parse(body);
      const users = readUsers();

      const emailExists = users.some(u => u.email === newUser.email);
      if (emailExists) {
        return res.end(
          JSON.stringify({ message: 'Email already exists' })
        );
      }

      users.push(newUser);
      writeUsers(users);

      res.end(JSON.stringify({ message: 'User added successfully' }));
    });
    return;
  }

  // ========= UPDATE USER =========
  if (method === 'PATCH' && url.startsWith('/user/')) {
    const id = url.split('/')[2];
    let body = '';

    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const updates = JSON.parse(body);
      const users = readUsers();
      const user = users.find(u => u.id === id);

      if (!user) {
        return res.end(JSON.stringify({ message: 'User not found' }));
      }

      Object.assign(user, updates);
      writeUsers(users);

      res.end(JSON.stringify({ message: 'User updated successfully' }));
    });
    return;
  }

  // ========= DELETE USER =========
  if (method === 'DELETE' && url.startsWith('/user/')) {
    const id = url.split('/')[2];
    const users = readUsers();
    const filteredUsers = users.filter(u => u.id !== id);

    writeUsers(filteredUsers);
    return res.end(
      JSON.stringify({ message: 'User deleted successfully' })
    );
  }

  // ========= NOT FOUND =========
  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Route not found' }));
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});





