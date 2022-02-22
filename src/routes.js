const express = require('express');
const { accountListing, createAccount, updateAccount, deleteAccount } = require('./controllers/bank');
const { balanceAccount, extractAccount } = require('./controllers/infoBank');
const { depositAccount, withdrawAccount, transferAccount } = require('./controllers/operation');
const { validarSenha } = require('./middleware');

const routes = express();


routes.get('/contas', validarSenha, accountListing);
routes.post('/contas', validarSenha, createAccount);
routes.put('/contas/:numeroConta/usuario', validarSenha, updateAccount);
routes.delete('/contas/:numeroConta', validarSenha, deleteAccount);
routes.post('/transacoes/depositar', depositAccount);
routes.post('/transacoes/sacar', withdrawAccount);
routes.post('/transacoes/transferir', transferAccount);
routes.get('/contas/saldo', balanceAccount);
routes.get('/contas/extrato', extractAccount);



module.exports = routes;