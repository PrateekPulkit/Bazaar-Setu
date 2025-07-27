const fetch = require('node-fetch');

async function register() {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testadmin',
      password: 'Test1234',
      role: 'admin',
      name: 'Test Admin',
      email: 'testadmin@example.com'
    })
  });

  const data = await response.json();
  console.log('Response:', data);
}

register().catch(console.error);
