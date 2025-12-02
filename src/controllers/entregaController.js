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
                distanciaKM,
                pesoCarga,
                valorKM,
                valorKG
            } = req.body;

            // -----------------------------
            //       VALIDAÇÕES
            // -----------------------------
            if (
                idCliente === undefined || dataPedido === undefined ||
                tipoEntrega === undefined || distanciaKM === undefined ||
                pesoCarga === undefined || valorKM === undefined || valorKG === undefined
            ) {
                return res.status(400).json({ erro: "Campos obrigatórios não foram preenchidos" });
            }

            if (isNaN(distanciaKM) || isNaN(pesoCarga) || isNaN(valorKM) || isNaN(valorKG)) {
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
            //       CÁLCULOS OFICIAIS
            // -----------------------------
            let valorDistancia = distanciaKM * valorKM;
            let valorPeso = pesoCarga * valorKG;

            let valorBaseEntrega = valorDistancia + valorPeso;

            let acrescimo = 0;
            let desconto = 0;
            let taxaExtra = 0;

            let valorFinal = valorBaseEntrega;

            // URGENTE = 20% de acréscimo
            if (tipoEntrega.toLowerCase() === "urgente") {
                acrescimo = valorBaseEntrega * 0.20;
                valorFinal += acrescimo;
            }

            // PESO > 50kg → taxa extra fixa de 15
            if (pesoCarga > 50) {
                taxaExtra = 15;
                valorFinal += taxaExtra;
            }

            // VALOR FINAL > 500 → desconto de 10%
            if (valorFinal > 500) {
                desconto = valorFinal * 0.10;
                valorFinal -= desconto;
            }

            // -----------------------------
            //   REGISTRAR PEDIDO + ENTREGA
            // -----------------------------
            const statusEntrega = "calculado";

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
            //   RETORNO AO CLIENTE
            // -----------------------------
            res.status(201).json({
                message: "Entrega registrada com sucesso!",
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
            console.error("Erro ao registrar entrega:", error);
            res.status(500).json({ message: "Erro interno no servidor ao registrar entrega!" });
        }
    }
}

module.exports = { entregaController };
