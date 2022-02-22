let { contas, saques, depositos, transferencias } = require('../database/bancodedados');

const balanceAccount = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
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

    if (senha !== locatedAccount.usuario.senha) {
        return res.status(400).json({
            "mensagem": "senha invalida"
        })
    }

    return res.status(200).json({
        "saldo": locatedAccount.saldo
    })
}

const extractAccount = (req, res) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
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

    if (senha !== locatedAccount.usuario.senha) {
        return res.status(400).json({
            "mensagem": "senha invalida"
        })
    }

    const informationAccount = {
        "depositos": depositos.filter(deposito => deposito.numero_conta === Number(numero_conta)),
        "saques": saques.filter(saque => saque.numero_conta === Number(numero_conta)),
        "transferenciaEnviadas": transferencias.filter(transferencia => transferencia.numero_conta_origem === Number(numero_conta)),
        "transferenciaRecebida": transferencias.filter(transferencia => transferencia.numero_conta_destino === Number(numero_conta))
    }
    return res.status(200).json(informationAccount)
}

module.exports = {
    balanceAccount,
    extractAccount

}