Command:
curl -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d "{\"username\":\"minzechen\",\"password\":\"Passw0rd!\"}"

Output:
{
  "message": "User successfully logged in",
  "username": "minzechen",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pbnplY2hlbiIsImlhdCI6MTc4ODQ5ODA3MiwiZXhwIjoxNzg4NTAxNjcyfQ.VLeFs_6ty9BwLTpnfdjE7m8fK7pQmP8B3C0T1uV5e44"
}
