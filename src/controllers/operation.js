const { format } = require('date-fns');
let { contas, saques, depositos, transferencias } = require('../database/bancodedados');


const depositAccount = (req, res) => {
    const { numero_conta, valor } = req.body
    const locatedAccount = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    });

    if (!numero_conta || !valor) {
        return res.status(400).json({
            "mensagem": "o campo de numero da conta e valor, são obrigatorios"
        })
    }

    if (!locatedAccount) {
        return res.status(400).json({
            "mensagem": "Conta não localizada"
        })
    }

    if (valor <= 0) {
        return res.status(400).json({
            "mensagem": "valor não permitido para deposito"
        })
    }

    if (locatedAccount) {
        locatedAccount.saldo = locatedAccount.saldo + valor
    }
    const recordDeposit = {
        "data": format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        "numero_conta": locatedAccount.numero,
        "valor": valor
    }

    depositos.push(recordDeposit);
    return res.status(200).json();
}

const withdrawAccount = (req, res) => {
    const { numero_conta, valor, senha } = req.body
    if (!numero_conta || !valor || !senha) {
        return res.status(400).json({
            "mensagem": "todos os campos são obrigatorios"
        })
    }
    const locatedAccount = contas.find((conta) => {
        return conta.numero === Number(numero_conta)
    });

    if (!locatedAccount) {
        return res.status(400).json({
            "mensagem": "Conta não localizada"
        })
    }
    if (valor <= 0) {
        return res.status(400).json({
            "mensagem": "O valor não pode ser menor que zero!"
        })
    }

    if (locatedAccount.saldo < valor) {
        return res.status(400).json({
            "mensagem": "não é possivel realizar o saque"
        })
    }

    if (senha !== locatedAccount.usuario.senha) {
        return res.status(400).json({
            "mensagem": "senha invalida"
        })
    }

    if (locatedAccount) {
        locatedAccount.saldo = locatedAccount.saldo - valor
    }

    const recordWithdrawal = {
        "data": format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        "numero_conta": locatedAccount.numero,
        "valor": valor
    }
    saques.push(recordWithdrawal)
    return res.status(200).json();
}

const transferAccount = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body

    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
        return res.status(400).json({
            "mensagem": "todos os campos são obrigatorios"
        })
    }
    const locatedAccountOrigin = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem)
    });

    if (!locatedAccountOrigin) {
        return res.status(400).json({
            "mensagem": "Conta de origem não localizada"
        })
    }

    const locatedAccountDestiny = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino)
    });

    if (!locatedAccountDestiny) {
        return res.status(400).json({
            "mensagem": "Conta de destino não localizada"
        })
    }

    if (senha !== locatedAccountOrigin.usuario.senha) {
        return res.status(400).json({
            "mensagem": "senha invalida"
        })
    }

    if (valor <= 0) {
        return res.status(400).json({
            "mensagem": "O valor não pode ser menor que zero!"
        })
    }

    if (locatedAccountOrigin.saldo < valor) {
        return res.status(400).json({
            "mensagem": "Saldo insuficiente!"
        })
    }
    if (locatedAccountOrigin && locatedAccountDestiny) {
        locatedAccountOrigin.saldo = locatedAccountOrigin.saldo - valor
        locatedAccountDestiny.saldo = locatedAccountDestiny.saldo + valor

    }

    let recordTransfer = {
        "data": format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        "numero_conta_origem": locatedAccountOrigin.numero,
        "numero_conta_destino": locatedAccountDestiny.numero,
        "valor": valor
    }
    transferencias.push(recordTransfer)

    return res.status(200).json()
}

module.exports = {
    depositAccount,
    withdrawAccount,
    transferAccount

}