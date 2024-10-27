## Project setup
```
npm install

check db.config.ts (in config) for database settings
convert templateEnv to .env
```

### Run
```
npm run start
```


### ROUTES
## 1. User Management

# POST: localhost:7000/api/users/register
Request: JSON (body)
{
    "email":"test1@yopmail.com",
    "password":"1234",
    "name":"Test1"
}
Reponse: {
    "id": 1,
    "name": "Test1",
    "email": "test1@yopmail.com",
    "updatedAt": "2024-10-27T19:15:42.991Z",
    "createdAt": "2024-10-27T19:15:42.991Z"
}


# POST: localhost:7000/api/users/login
Request: JSON (body)
{
    "email":"test1@yopmail.com",
    "password":"1234"
}
Reponse: {
    "user": {
        "id": 1,
        "name": "Test1",
        "email": "test1@yopmail.com",
        "createdAt": "2024-10-27T19:15:42.991Z",
        "updatedAt": "2024-10-27T19:15:42.991Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMDA1NjU1NSwiZXhwIjoxNzMwMDYwMTU1fQ.Lyro17AkRzhrvJNNaY77ntMcSqWh1sp5HQ37zkq18Qw"
}


#  GET: localhost:7000/api/users/profile
Request: Added Bearer Token in Authorization
example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTczMDA1NjU1NSwiZXhwIjoxNzMwMDYwMTU1fQ.Lyro17AkRzhrvJNNaY77ntMcSqWh1sp5HQ37zkq18Qw"
Reponse: {
    "id": 1,
    "name": "Test1",
    "email": "test1@yopmail.com",
    "createdAt": "2024-10-27T19:15:42.991Z",
    "updatedAt": "2024-10-27T19:15:42.991Z"
}


## 2. User Management

# POST: localhost:7000/api/chats
Request: JSON (body) WITH Bearer Token
{
    "name":"Test Chat",
    "userIds":[1,2]
}
Reponse: {
    "id": 1,
    "name": "Test Chat",
    "isActive": true,
    "updatedAt": "2024-10-27T19:50:46.887Z",
    "createdAt": "2024-10-27T19:50:46.887Z"
}

# GET: localhost:7000/api/chats
Request: WITH Bearer Token

Reponse: [
    {
        "id": 1,
        "name": "Test Chat",
        "isActive": true,
        "createdAt": "2024-10-27T19:50:46.887Z",
        "updatedAt": "2024-10-27T19:50:46.887Z",
        "users": [
            {
                "id": 1,
                "name": "Test1",
                "createdAt": "2024-10-27T19:15:42.991Z",
                "updatedAt": "2024-10-27T19:15:42.991Z"
            },
            {
                "id": 2,
                "name": "Test2",
                "createdAt": "2024-10-27T19:26:03.533Z",
                "updatedAt": "2024-10-27T19:26:03.533Z"
            }
        ],
        "messages": []
    }
]

# GET: localhost:7000/api/chats/:chatId example(1) localhost:7000/api/chats/1
Request: WITH Bearer Token

Reponse: {
    "id": 1,
    "name": "Test Chat",
    "isActive": true,
    "createdAt": "2024-10-27T19:50:46.887Z",
    "updatedAt": "2024-10-27T19:50:46.887Z",
    "users": [
        {
            "id": 1,
            "name": "Test1",
            "createdAt": "2024-10-27T19:15:42.991Z"
        },
        {
            "id": 2,
            "name": "Test2",
            "createdAt": "2024-10-27T19:26:03.533Z"
        }
    ],
    "messages": []
}

## 3. Messaging

# POST: localhost:7000/api/chats/1/messages
Request: JSON (body) WITH Bearer Token
{
    "message":"First Message"
}

Reponse: {
    "id": 1,
    "message": "First Message",
    "userId": 1,
    "chatId": 1,
    "updatedAt": "2024-10-27T20:30:36.641Z",
    "createdAt": "2024-10-27T20:30:36.641Z"
}

# GET: localhost:7000/api/chats/1/messages?page=1
Request: WITH Bearer Token

Reponse: [
    {
        "id": 1,
        "message": "First Message",
        "userId": 1,
        "chatId": 1,
        "createdAt": "2024-10-27T20:30:36.641Z",
        "updatedAt": "2024-10-27T20:30:36.641Z"
    }
]

## 3. Partially Implemented (Required UI Development)