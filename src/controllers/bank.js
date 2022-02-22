
let { contas } = require('../database/bancodedados');


let identifier = 0


const accountListing = (req, res) => {
    return res.status(200).json({ contas })
}

const createAccount = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({
            "mensagem": "todos os campos são obrigatórios"
        })
    }

    const cpfExisting = contas.find((cpfNumero) => {
        return cpfNumero.usuario.cpf === cpf;
    });
    const emailExisting = contas.find((emailExisting) => {
        return emailExisting.usuario.email === email;
    })

    if (cpfExisting || emailExisting) {
        return res.status(400).json({
            "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
        })
    }
    const newAccount = {
        numero: identifier += 1,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha

        }

    }
    contas.push(newAccount);
    return res.status(200).json();

}

const updateAccount = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!Number(numeroConta)) {
        return res.status(400).json({
            "mensagem": "A conta não é valida"
        })
    }

    const update = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    });

    if (!update) {
        return res.status(400).json({
            "mensagem": "Conta não localizada"
        })
    }

    if (!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({
            "mensagem": "Ao menos um campo deve ser atualizado."
        })
    }
    const cpfExisting = contas.find((cpfNumero) => {
        return cpfNumero.usuario.cpf === cpf;
    });
    const emailExisting = contas.find((emailExisting) => {
        return emailExisting.usuario.email === email;
    });

    if (cpfExisting || emailExisting) {
        return res.status(400).json({
            "mensagem": "Já existe uma conta com o cpf ou e-mail informado!"
        })
    }

    if (nome) {
        update.usuario.nome = nome;
    }

    if (data_nascimento) {
        update.usuario.data_nascimento = data_nascimento;
    }

    if (telefone) {
        update.usuario.telefone = telefone;
    }

    if (senha) {
        update.usuario.senha = senha;

    }

    return res.status(200).json();
}

const deleteAccount = (req, res) => {
    const { numeroConta } = req.params;
    if (!Number(numeroConta)) {
        return res.status(400).json({
            "mensagem": "A conta não é valida"
        });
    }
    const locatedAccount = contas.find((conta) => {
        return conta.numero === Number(numeroConta)
    });

    if (!locatedAccount) {
        return res.status(400).json({
            "mensagem": "Conta não localizada"
        })
    }

    if (locatedAccount.saldo !== 0) {
        return res.status(400).json({ "mensagem": "A conta só pode ser removida se o saldo for zero!" })
    }

    contas = contas.filter((conta) => {
        return conta.numero !== Number(numeroConta);
    })
    return res.status(200).json();
}




module.exports = {
    accountListing,
    createAccount,
    updateAccount,
    deleteAccount
}