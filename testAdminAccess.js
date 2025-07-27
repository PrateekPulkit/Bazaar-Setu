const fetch = require('node-fetch');

async function testAdminAccess() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg1ZmVmMjg3MjIwYjM2ZDM1NDY3NzQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTM2MTIxMTQsImV4cCI6MTc1NDIxNjkxNH0.rFYvccgPQ5spYGpAR8rr5ps0DTqp6sYTOLWndjfl9cA';

  const response = await fetch('http://localhost:5000/api/admin/dashboard', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  console.log('Response:', data);
}

testAdminAccess().catch(console.error);
