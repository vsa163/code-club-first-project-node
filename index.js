const express = require("express")
const uuid = require('uuid')

const port = 3000

const app = express()
app.use(express.json())

/* 

  -Quey params => meusite.com/users?nome=vinicius&age=35 // FILTROS

  app.get('/users', (request, response) => {
     const { name, age } = request.query

     return response.json({ name, age })
})


  - Route params => /user/2  // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECÍFIVO
  
  app.get('/users/:id', (request, response) => {
     const { id } = request.params
     console.log(id)

     return response.json({id})
}) 


  - Request Body =>{ "name":"Vinicius", "age":}

app.use(express.json())
  app.get('/users', (request, response) => {
     console.log(request.body)
     
     return response.json({ message:""})
})

     - GET          => Buscar informação no back-end
     - POST         => Criar informação no back-end
     - PUT / PATCH  => Alterar/Atualizar informação no back-end
     - DELETE       => Deletar informação no back-end
  */
const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}
app.get('/users', (request, response) => {
    return response.json(users)
})

app.post('/users', (request, response) => {
    const { name, age } = request.body

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(users)
})

app.put('/users/:id', checkUserId, (request, response) => {

    const { name, age } = request.body
    const index = request.userIndex
    const id = request.userId

    const updatedUser = { id, name, age }

    users[index] = updatedUser

    return response.json(updatedUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)
    
    return response.status(204).json()
})


app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})
