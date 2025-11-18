const { clienteModel } = require("../models/clienteModel");

const clienteController = {

    // ===================================================== //
    // LISTAR CLIENTES                                       //
    // GET /clientes  ou  GET /clientes?idCliente=UUID       //
    // ===================================================== //
    listarClientes: async (req, res) => {
        try {
            const { idCliente } = req.query;

            if (idCliente) {

                if (idCliente.length !== 36) {
                    return res.status(400).json({ erro: "ID do cliente inválido." });
                }

                const cliente = await clienteModel.buscarUm(idCliente);

                if (!cliente || cliente.length === 0) {
                    return res.status(404).json({ erro: "Cliente não encontrado." });
                }

                return res.status(200).json(cliente[0]);
            }

            const clientes = await clienteModel.buscarTodos();
            return res.status(200).json(clientes);

        } catch (error) {
            console.error("ERRO ao listar clientes:", error);
            return res.status(500).json({ erro: "Erro interno ao listar clientes." });
        }
    },

    // ===================================================== //
    // ADICIONAR CLIENTE                                     //
    // POST /clientes                                        //
    // ===================================================== //
    adicionarCliente: async (req, res) => {
        try {
            const { 
                nomeCliente, 
                cpfCliente, 
                telefoneCliente, 
                emailCliente, 
                enderecoCliente 
            } = req.body;

            // Validação básica
            if (!nomeCliente || !cpfCliente || isNaN(cpfCliente) || 
                !telefoneCliente || !emailCliente || !enderecoCliente) {

                return res.status(400).json({ erro: "Campos obrigatórios não preenchidos!" });
            }

            // CPF duplicado
            const existeCPF = await clienteModel.buscarCPF(cpfCliente);
            if (existeCPF.length > 0) {
                return res.status(409).json({ erro: "CPF já cadastrado!" });
            }

            // Email duplicado
            const existeEmail = await clienteModel.buscarEmail(emailCliente);
            if (existeEmail.length > 0) {
                return res.status(409).json({ erro: "Email já cadastrado!" });
            }

            // Telefone duplicado
            const existeTelefone = await clienteModel.buscarTelefone(telefoneCliente);
            if (existeTelefone.length > 0) {
                return res.status(409).json({ erro: "Telefone já cadastrado!" });
            }

            // Inserção
            await clienteModel.inserirCliente(
                nomeCliente, 
                cpfCliente, 
                telefoneCliente, 
                emailCliente, 
                enderecoCliente
            );

            return res.status(201).json({ mensagem: "Cliente cadastrado com sucesso!" });

        } catch (error) {
            console.error("ERRO ao cadastrar cliente:", error);
            return res.status(500).json({ erro: "Erro no servidor ao cadastrar cliente!" });
        }
    },

    // ===================================================== //
    // ATUALIZAR CLIENTE                                     //
    // PUT /clientes/:idCliente                              //
    // ===================================================== //
    atualizarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;
            const { 
                nomeCliente, 
                cpfCliente, 
                telefoneCliente, 
                emailCliente, 
                enderecoCliente 
            } = req.body;

            if (idCliente.length !== 36) {
                return res.status(400).json({ erro: "ID do cliente inválido." });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            const atual = cliente[0];

            // Atualiza apenas o que foi enviado
            const nomeAtualizado = nomeCliente ?? atual.nomeCliente;
            const cpfAtualizado = cpfCliente ?? atual.cpfCliente;
            const telefoneAtualizado = telefoneCliente ?? atual.telefoneCliente;
            const emailAtualizado = emailCliente ?? atual.emailCliente;
            const enderecoAtualizado = enderecoCliente ?? atual.enderecoCliente;

            await clienteModel.atualizarCliente(
                idCliente,
                nomeAtualizado,
                cpfAtualizado,
                telefoneAtualizado,
                emailAtualizado,
                enderecoAtualizado
            );

            return res.status(200).json({ mensagem: "Cliente atualizado com sucesso!" });

        } catch (error) {
            console.error("ERRO ao atualizar cliente:", error);
            return res.status(500).json({ erro: "Erro interno no servidor ao atualizar cliente!" });
        }
    },

    // ===================================================== //
    // DELETAR CLIENTE                                       //
    // DELETE /clientes/:idCliente                           //
    // ===================================================== //
    deletarCliente: async (req, res) => {
        try {
            const { idCliente } = req.params;

            if (idCliente.length !== 36) {
                return res.status(400).json({ erro: "ID do cliente inválido." });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            await clienteModel.deletarCliente(idCliente);

            return res.status(200).json({ mensagem: "Cliente deletado com sucesso!" });

        } catch (error) {
            console.error("ERRO ao deletar cliente:", error);
            return res.status(500).json({ erro: "Erro interno no servidor ao deletar cliente!" });
        }
    }
};

module.exports = { clienteController };
