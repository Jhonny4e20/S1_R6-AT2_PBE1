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
                distanciaKM,
                pesoCarga,
                valorKM,
                valorKG
            } = req.body;

            // -----------------------------
            //       VALIDAÇÕES
            // -----------------------------
            if (
                idCliente == undefined || dataPedido == undefined ||
                tipoEntrega == undefined || distanciaKM == undefined ||
                pesoCarga == undefined || valorKM == undefined || valorKG == undefined
            ) {
                return res.status(400).json({ erro: "Campos obrigatórios não foram preenchidos" });
            }

            if (isNaN(distanciaKM) || isNaN(pesoCarga) || isNaN(valorKM) || isNaN(valorKG)) {
                return res.status(400).json({ erro: "Campos preenchidos com valores inválidos" });
            }

            if (idCliente.length != 36) {
                return res.status(400).json({ erro: "Id do Cliente inválido" });
            }

            const data = new Date(dataPedido);
            if (isNaN(data.getTime())) {
                return res.status(400).json({ erro: "Data do pedido inválida" });
            }

            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length != 1) {
                return res.status(404).json({ erro: "Cliente não encontrado" });
            }

            // -----------------------------
            //          CÁLCULOS
            // -----------------------------
            let valorDistancia = distanciaKM * valorKM;
            let valorPeso = pesoCarga * valorKG;

            let valorBaseEntrega = valorDistancia + valorPeso;

            let acrescimo = 0;
            let desconto = 0;
            let taxaExtra = 0;

            let valorFinal = valorBaseEntrega;

            // URGENTE = acrescimo 20%
            if (tipoEntrega.toLowerCase() === "urgente") {
                acrescimo = valorBaseEntrega * 0.20;
                valorFinal += acrescimo;
            }

            // PESO > 50kg → taxa extra fixa de 15
            if (pesoCarga > 50) {
                taxaExtra = 15;
                valorFinal += taxaExtra;
            }

            // VALOR FINAL > 500 → desconto 10%
            if (valorFinal > 500) {
                desconto = valorFinal * 0.10;
                valorFinal -= desconto;
            }

            const statusEntrega = "calculado";

            // -----------------------------
            //   REGISTRO NO BANCO
            // -----------------------------
            await pedidoModel.inserirPedidos(
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKM,
                pesoCarga,
                valorKM,
                valorKG,
                valorDistancia,
                valorPeso,
                valorFinal,
                acrescimo,
                desconto,
                taxaExtra,
                statusEntrega
            );

            // -----------------------------
            //      RETORNO AO CLIENTE
            // -----------------------------
            res.status(201).json({
                message: "Pedido cadastrado com sucesso!",
                calculo: {
                    valorDistancia,
                    valorPeso,
                    acrescimo,
                    desconto,
                    taxaExtra,
                    valorFinal,
                    statusEntrega
                }
            });

        } catch (error) {
            console.error("Erro ao cadastrar pedido:", error);
            res.status(500).json({ message: "Erro interno no servidor ao cadastrar pedido!" });
        }

    },

    atualizarPedido: async (req, res) => {
        try {
            const { idPedido } = req.params;
            const {
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKM,
                pesoCarga,
                valorKM,
                valorKG
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
                distanciaKM ?? pedidoAtual.distanciaKM,
                pesoCarga ?? pedidoAtual.pesoCarga,
                valorKM ?? pedidoAtual.valorKM,
                valorKG ?? pedidoAtual.valorKG
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
