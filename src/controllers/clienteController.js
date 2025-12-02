const { clienteModel } = require("../models/clienteModel");

const clienteController = {
    
    listarClientes: async (req, res) => {
        try {
            const { idCliente } = req.query; //pega o idCliente da query string

            if (idCliente) {

                if (idCliente.length !== 36) { //verifica se o idCliente tem 36 caracteres
                    return res.status(400).json({ erro: "ID do cliente inválido" });
                }

                const cliente = await clienteModel.buscarUm(idCliente); //busca o cliente pelo idCliente

                return res.status(200).json(cliente);
            }

            const clientes = await clienteModel.buscarTodos(); //busca todos os clientes
            res.status(200).json(clientes); //retorna a lista de clientes

        } catch (error) {
            console.error("ERRO ao listar clientes:", error);
            res.status(500).json({ erro: "Erro interno ao listar clientes" }); //retorna erro 500 em caso de falha no servidor
        }
    },
    
    adicionarCliente: async (req, res) => {
        try {
            const { nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente } = req.body; //pega os dados do corpo da requisição

            if (!nomeCliente || !cpfCliente || isNaN(cpfCliente) || !telefoneCliente || !emailCliente || !enderecoCliente) { //valida os campos obrigatórios
                return res.status(400).json({ erro: "Campos obrigatórios não preenchidos!" });
            }

            const existeCPF = await clienteModel.buscarCPF(cpfCliente); //verifica se o CPF já está cadastrado
            if (existeCPF.length > 0) {
                return res.status(409).json({ erro: "CPF já cadastrado!" }); //retorna erro 409 em caso de conflito
            }

            await clienteModel.inserirCliente(nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente); //insere o novo cliente no banco de dados

            res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!" }); //retorna sucesso 201 em caso de criação bem-sucedida

        } catch (error) {
            console.error("ERRO ao cadastrar cliente:", error);
            res.status(500).json({ erro: "Erro no servidor ao cadastrar cliente!" }); //retorna erro 500 em caso de falha no servidor
        }
    },

    atualizarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params; //pega o idCliente dos parâmetros da rota
            const { nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente } = req.body; //pega os dados do corpo da requisição

            if (idCliente.length !== 36) {
                return res.status(400).json({ erro: "ID do cliente inválido" }); //valida o idCliente
            }

            const cliente = await clienteModel.buscarUm(idCliente); //busca o cliente pelo idCliente

            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" }); //retorna erro 404 se o cliente não for encontrado
            }

            const clienteAtual = cliente[0]; //pega o cliente atual

            const nomeAtualizado = nomeCliente ?? clienteAtual.nomeCliente; //se o nomeCliente for fornecido, usa-o; caso contrário, mantém o nome atual
            const cpfAtualizado = cpfCliente ?? clienteAtual.cpfCliente; //mesma lógica para CPF
            const telefoneAtualizado = telefoneCliente ?? clienteAtual.telefoneCliente; //mesma lógica para telefone
            const emailAtualizado = emailCliente ?? clienteAtual.emailCliente; //mesma lógica para email
            const enderecoAtualizado = enderecoCliente ?? clienteAtual.enderecoCliente;  //mesma lógica para endereço

            await clienteModel.atualizarCliente( //atualiza o cliente no banco de dados
                idCliente,
                nomeAtualizado,
                cpfAtualizado,
                telefoneAtualizado,
                emailAtualizado,
                enderecoAtualizado
            );

            res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" });

        } catch (error) {
            console.error("ERRO ao atualizar cliente:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar cliente!" }); //retorna erro 500 em caso de falha no servidor
        }
    },

    deletarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params; //pega o idCliente dos parâmetros da rota

            if (idCliente.length !== 36) { //valida o idCliente
                return res.status(400).json({ erro: "ID do cliente inválido" });
            }

            const cliente = await clienteModel.buscarUm(idCliente); //busca o cliente pelo idCliente

            if (!cliente || cliente.length !== 1) { 
                return res.status(404).json({ erro: "Cliente não encontrado!" }); //retorna erro 404 se o cliente não for encontrado
            }

            const pedido = await pedidoModel.buscarUm(idCliente)

            if(pedido.length > 0){
                return res.status(409).json({message: "Entrega e pedido associado ao seu id, os delete para prosseguir com a ação!"});
            }

            res.status(200).json({ mensagem: "Cliente deletado com sucesso!" });

        } catch (error) {
            console.error("ERRO ao deletar cliente:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao deletar cliente!" }); //retorna erro 500 em caso de falha no servidor
        }
    }
};

module.exports = { clienteController }; //exporta o clienteController