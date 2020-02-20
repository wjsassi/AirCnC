const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect ('mongodb+srv://dbusername:gaivota22@cluster0-hsfbm.mongodb.net/BusStopDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connectedUsers = {}; // Não usar em produção, usar banco de dados para gravar

io.on('connection', socket => {
    //console.log(socket.handshake.query);
    //console.log('Usuario conectado', socket.id);

    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;
    
    // Esse trecho envia uma mensagem ou pacote para o cliente, depois de 4 segundo
    //setTimeout(() => {
    //    socket.emit('Olá', 'Welson');
    //}, 4000);
    // socket.emit('message', 'o que vai ser enviado'); // aqui envia na hora
});

app.use(( req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    return next(); // se nao usar o next, ele não executa nada do que está nas linhas abaixo
});

app.use(cors()); // origin: 'URL ou IP' aqui pode configurar o endereco que pode acessar o backend
app.use(express.json()); // um componente para que o express utilize dados no formado json
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

/// Tudo que está comentado aqui foi para demonstrar a utilização de cada tipo de rota

// Existe app.post app.put e app.delete também
// get buscar informações
// post enviar dados
// put editar dados
// delete apagar dados

// request.query = acessar os paramentros da query (filtros para consultas)
// request.params = acessar route params (para edicao e deleção de dados) envia um parametro para ser chave
// request.body = acessar os dados enviados no corpo da requisicao... inserir ou alterar dados

/*app.post('/users', (request, response) => {
    return response.json(request.body);
});
app.get('/users', (request, response) => {
    return response.json({ idade: request.query.idade });
});

app.put('/users/:id', (request, response) => {
    return response.json({ id: request.params.id });
});
*/

server.listen(3333);
