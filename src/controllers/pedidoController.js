const { pedidoModel } = require("../models/pedidoModel");
const { clienteModel } = require("../models/clienteModel");

const pedidoController = {

    listarPedidos: async (req, res) => {
        try {
            const pedidos = await pedidoModel.buscarTodos();
            res.status(200).json(pedidos);

        } catch (error) {
            console.error("ERRO ao listar pedidos:", error);
            res.status(500).json({ erro: "ERRO interno ao listar pedidos!" });
        }
    },

    criarPedido: async (req, res) => {
        try {
            const {
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKm,
                pesoCarga,
                valorKm,
                valorKg
            } = req.body;

            if (
                !idCliente || !dataPedido || !tipoEntrega ||
                distanciaKm == undefined || pesoCarga == undefined ||
                valorKm == undefined || valorKg == undefined
            ) {
                return res.status(400).json({ erro: "Campos obrigatórios não preenchidos!" });
            }

            if (idCliente.length !== 36) {
                return res.status(400).json({ erro: "ID do cliente inválido!" });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            await pedidoModel.inserirPedido(
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKm,
                pesoCarga,
                valorKm,
                valorKg
            );

            res.status(201).json({ mensagem: "Pedido cadastrado com sucesso!" });

        } catch (error) {
            console.error("ERRO ao cadastrar pedido:", error);
            res.status(500).json({ erro: "ERRO interno ao cadastrar pedido!" });
        }
    },

    atualizarPedido: async (req, res) => {
        try {
            const { idPedido } = req.params;
            const {
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKm,
                pesoCarga,
                valorKm,
                valorKg
            } = req.body;

            if (idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido!" });
            }

            const pedido = await pedidoModel.buscarUm(idPedido);

            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado!" });
            }

            if (idCliente) {
                if (idCliente.length !== 36) {
                    return res.status(400).json({ erro: "ID do cliente inválido!" });
                }

                const cliente = await clienteModel.buscarUm(idCliente);
                if (!cliente || cliente.length !== 1) {
                    return res.status(404).json({ erro: "Cliente não encontrado!" });
                }
            }

            const pedidoAtual = pedido[0];

            await pedidoModel.atualizarPedido(
                idPedido,
                idCliente ?? pedidoAtual.idCliente,
                dataPedido ?? pedidoAtual.dataPedido,
                tipoEntrega ?? pedidoAtual.tipoEntrega,
                distanciaKm ?? pedidoAtual.distanciaKm,
                pesoCarga ?? pedidoAtual.pesoCarga,
                valorKm ?? pedidoAtual.valorKm,
                valorKg ?? pedidoAtual.valorKg
            );

            res.status(200).json({ mensagem: "Pedido atualizado com sucesso!" });

        } catch (error) {
            console.error("ERRO ao atualizar pedido:", error);
            res.status(500).json({ erro: "Erro interno ao atualizar pedido!" });
        }
    },

    deletarPedido: async (req, res) => {
        try {
            const { idPedido } = req.params;

            if (idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido!" });
            }

            const pedido = await pedidoModel.buscarUm(idPedido);

            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado!" });
            }

            await pedidoModel.deletarPedido(idPedido);

            res.status(200).json({ mensagem: "Pedido deletado com sucesso!" });

        } catch (error) {
            console.error("ERRO ao deletar pedido:", error);
            res.status(500).json({ erro: "Erro interno ao deletar pedido!" });
        }
    }
};

module.exports = { pedidoController };
