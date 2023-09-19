# coding-project-template
POST http://localhost:5000/register
{
  "username": "johnny",
  "password": "password123"
}
POST http://localhost:5000/customer/login
{
  "username": "johnny",
  "password": "password123"
}
PUT http://localhost:5000/customer/review/2
{
  "user": "johnny",
  "comment": "This book is amazing!"
}
DELETE http://localhost:5000/customer/review/2
{
  "user": "johnny"
}
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvaG5ueSIsImlhdCI6MTY5NTEzODk2NCwiZXhwIjoxNjk1MTQyNTY0fQ.NJgNPa2m8qzVAvEV1JLNCBXlET_szUhBhvOD7htqhCk