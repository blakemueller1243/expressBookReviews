# coding-project-template

## Register command
POST http://localhost:5000/register
{
  "username": "johnny",
  "password": "password123"
}

## Login command
POST http://localhost:5000/customer/login
{
  "username": "johnny",
  "password": "password123"
}

## Review Command
PUT http://localhost:5000/customer/review/2
{
  "user": "johnny",
  "comment": "This book is amazing!"
}

## Delete review command
DELETE http://localhost:5000/customer/review/2
{
  "user": "johnny"
}
