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
        origin: '*' // Libera acesso para qualquer requisição
    })
);

var userList = [{
    id: 1,
    name: 'Lucas',
    email: 'lucas.silva@indigohive.com.br',
    isDeleted: false
}];
var nextId = 1;

// Endpoint para verificar se a API está rodando
app.get('/health', (_req, res) => {
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
            email: email,
            isDeleted: false
        });

        console.log(userList);

        return res.status(201).json('Usuário criado com sucesso!');
    }
});

// GET: http://localhost:3000/users
app.get('/users', (_req, res) => {

    for (let i = 0; i < userList.length; i++) {
        if (!userList[i].isDeleted) {
            res.status(200).json(userList);
        }
        if (i == userList.length - 1) {
            res.status(404).json('Não há usuários cadastrados.');
            break;
        }
    }
});

// GET: http://localhost:3000/user/1
app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = id - 1;

    const findId = userList.some(
        userList => userList.id - 1 === id
    );

    if (findId && !userList[index].isDeleted) {
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

    if (userList[index].isDeleted) {
        res.status(404).json(`Não há nenhum usuário com o ID ${id}`);
    }

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
});

// DELETE: http://localhost:3000/user/1
app.delete('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = id - 1;

    userList[index].isDeleted = true;

    if (userList[index].isDeleted) {
        res.status(204).json('Usuário não consta mais na lista de dados.');
    }
});
