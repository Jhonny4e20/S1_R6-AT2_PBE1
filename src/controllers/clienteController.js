const { clienteModel } = require("../models/clienteModel");

const clienteController = {
    
    listarClientes: async (req, res) => {
        try {
            const { idCliente } = req.query;

            if (idCliente) {

                if (idCliente.length !== 36) {
                    return res.status(400).json({ erro: "ID do cliente inválido" });
                }

                const cliente = await clienteModel.buscarUm(idCliente);

                return res.status(200).json(cliente);
            }

            const clientes = await clienteModel.buscarTodos();
            res.status(200).json(clientes);

        } catch (error) {
            console.error("ERRO ao listar clientes:", error);
            res.status(500).json({ erro: "Erro interno ao listar clientes" });
        }
    },
    
    adicionarCliente: async (req, res) => {
        try {
            const { nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente } = req.body;

            if (!nomeCliente || !cpfCliente || isNaN(cpfCliente) || !telefoneCliente || !emailCliente || !enderecoCliente) {
                return res.status(400).json({ erro: "Campos obrigatórios não preenchidos!" });
            }

            const existeCPF = await clienteModel.buscarCPF(cpfCliente);
            if (existeCPF.length > 0) {
                return res.status(409).json({ erro: "CPF já cadastrado!" });
            }

            await clienteModel.inserirCliente(nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente);

            res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!" });

        } catch (error) {
            console.error("ERRO ao cadastrar cliente:", error);
            res.status(500).json({ erro: "Erro no servidor ao cadastrar cliente!" });
        }
    },

    atualizarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente } = req.body;

            if (idCliente.length !== 36) {
                return res.status(400).json({ erro: "ID do cliente inválido" });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            const clienteAtual = cliente[0];

            const nomeAtualizado = nomeCliente ?? clienteAtual.nomeCliente;
            const cpfAtualizado = cpfCliente ?? clienteAtual.cpfCliente;
            const telefoneAtualizado = telefoneCliente ?? clienteAtual.telefoneCliente;
            const emailAtualizado = emailCliente ?? clienteAtual.emailCliente;
            const enderecoAtualizado = enderecoCliente ?? clienteAtual.enderecoCliente; 

            await clienteModel.atualizarCliente(
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
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar cliente!" });
        }
    },

    deletarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;

            if (idCliente.length !== 36) {
                return res.status(400).json({ erro: "ID do cliente inválido" });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            await clienteModel.deletarCliente(idCliente);

            res.status(200).json({ mensagem: "Cliente deletado com sucesso!" });

        } catch (error) {
            console.error("ERRO ao deletar cliente:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao deletar cliente!" });
        }
    }
};

module.exports = { clienteController };
