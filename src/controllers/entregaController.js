const { entregaModel } = require('../models/entregaModel');
const { pedidoModel } = require("../models/pedidoModel");
const { clienteModel } = require('../models/clienteModel');

const entregaController = {
    listarEntregas: async (req, res) => {
        try {
            const entregas = await entregaModel.buscarTodas();
            res.status(200).json(entregas);

        } catch (error) {
            console.error("ERRO ao listar entregas:", error);
            res.status(500).json({ erro: "ERRO interno ao listar entregas!" });
        }
    },

    registrarEntrega: async (req, res) => {
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

            // -----------------------------
            //       VALIDAÇÕES
            // -----------------------------
            if (
                idCliente === undefined || dataPedido === undefined ||
                tipoEntrega === undefined || distanciaKm === undefined ||
                pesoCarga === undefined || valorKm === undefined || valorKg === undefined
            ) {
                return res.status(400).json({ erro: "Campos obrigatórios não foram preenchidos" });
            }

            if (isNaN(distanciaKm) || isNaN(pesoCarga) || isNaN(valorKm) || isNaN(valorKg)) {
                return res.status(400).json({ erro: "Campos preenchidos com valores inválidos" });
            }

            if (idCliente.length !== 36) {
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
            //       CÁLCULOS
            // -----------------------------
            let valorDistanciaEntrega = distanciaKm * valorKm;
            let valorPesoEntrega = pesoCarga * valorKg;

            let valorFinalEntrega = valorDistanciaEntrega + valorPesoEntrega;

            let acrescimoEntrega = 0;
            let taxaExtraEntrega = 0;
            let descontoEntrega = 0;

            // URGENTE (20% de acrescimo)
            if (tipoEntrega.toLowerCase() === "urgente") {
                acrescimoEntrega = valorFinalEntrega * 0.2;
                valorFinalEntrega = valorFinalEntrega + acrescimoEntrega;
            }

            // PESO > 50kg → taxa extra de 15
            if (pesoCarga > 50) {
                taxaExtraEntrega = 15;
                valorFinalEntrega = valorFinalEntrega + taxaExtraEntrega;
            }

            // VALOR FINAL > 500 → desconto de 10%
            if (valorFinalEntrega > 500) {
                descontoEntrega = valorFinalEntrega * 0.1;
                valorFinalEntrega = valorFinalEntrega - descontoEntrega;
            }

            // -----------------------------
            //       SALVAR NO BANCO
            // -----------------------------
            await pedidoModel.inserirPedido(
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKm,
                pesoCarga,
                valorKm,
                valorKg,
                valorDistanciaEntrega,
                valorPesoEntrega,
                acrescimoEntrega,
                taxaExtraEntrega,
                descontoEntrega,
                valorFinalEntrega
            );

            // -----------------------------
            //     RETORNO PARA O CLIENTE
            // -----------------------------
            res.status(201).json({
                message: "Pedido cadastrado com sucesso!",
                calculo: {
                    valorDistanciaEntrega,
                    valorPesoEntrega,
                    acrescimoEntrega,
                    taxaExtraEntrega,
                    descontoEntrega,
                    valorFinalEntrega
                }
            });

        } catch (error) {
            console.error("Erro ao cadastrar pedido:", error);
            res.status(500).json({ message: "Erro interno no servidor ao cadastrar pedido!" });
        }
    },

    atualizarEntrega: async (req, res) => {
        try {
            res.status(200).json({ message: "Atualizar entrega ainda não implementado." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro interno ao atualizar entrega!" });
        }
    },

    deletarEntrega: async (req, res) => {
        try {
            res.status(200).json({ message: "Deletar entrega ainda não implementado." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro interno ao deletar entrega!" });
        }
    }
};

module.exports = { entregaController };