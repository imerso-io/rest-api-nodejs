const express = require('express');
const cors = require('cors');

const app = express();

const port = 3000; // or process.env.PORT

app.listen(port, () =>
    console.log(`
🚀 API on-line: http://localhost:${port}
⭐️ Acesse o repositório do GitHub: https://github.com/inobrasil/restAPI-nodeJS`),
);

app.use(express.json());

app.use(
    cors({
        origin: `http://localhost:5173`
        // or origin: '*' - Libera acesso para qualquer requisição
})
);

var userList = [];
var nextId = 1;

// Endpoint para verificar se a API está rodando
app.get('/health', (req, res) => {
    res.status(204).end();
});

// POST: http://localhost:3000/signup
app.post('/signup', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    if (!name || !email) {
        res.status(400).json('Nome e/ou e-mail vazio.');
    }

    const findEmail = userList.some(
        userList => userList.email === email
        );

    if (findEmail) {
        res.status(409).json(`O email "${email}" já existe.`);
    } else {

        userList.push({
            id: nextId++,
            name: name,
            email: email
        });

        console.log(userList);

        return res.status(201).json('Usuário criado com sucesso!');
    }
});

// GET: http://localhost:3000/users
app.get('/users', (req, res) => {
    if (userList.length === 0) {
        res.status(404).json('Não há nenhum usuário cadastrado.');
    } else {
        res.status(200).json(userList);
    }
});

// GET: http://localhost:3000/user/1
app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = id - 1;

    const findId = userList.some(
        userList => userList.id === id
        );

    if (findId) {
        res.status(200).json(userList[index]);
    }

    res.status(404).json(`Não há nenhum usuário com o ID ${id}`);
});

// PATCH: http://localhost:3000/user/1
app.patch('/user/:id/', (req, res) => {
    const id = parseInt(req.params.id);
    const index = id - 1;

    const name = req.body.name;
    const email = req.body.email;

    if (userList.length === 0) {
        res.status(404).json('Não há nenhum usuário cadastrado.');
    }  else {

        if (!name && !email) {
            res.status(400).json('Nome e e-mail vázio, digite o que quer editar.');
        }

        if (name !== undefined && name !== null && name !== "") {
            userList[index].name = name;
        }

        if (email !== undefined && email !== null && email !== "") {
            userList[index].email = email;
        }

        res.status(200).json('Usuário atualizado com sucesso!');
    }
});

// DELETE: http://localhost:3000/user/1
app.delete('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = id - 1;

    userList.splice(index, 1)

    if (userList[index] === undefined) {
        res.status(204).json('Usuário não consta mais na lista de dados.');
    }
});
