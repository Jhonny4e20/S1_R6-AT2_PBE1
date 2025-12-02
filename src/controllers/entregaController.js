const { entregaModel } = require('../models/entregaModel');
const { pedidoModel } = require("../models/pedidoModel");
const { clienteModel } = require('../models/clienteModel');

// Controller responsável pelas regras de negócio da Entrega
const entregaController = {

    // -------------------------------------
    // LISTAR TODAS AS ENTREGAS
    // GET /entregas
    // -------------------------------------
    listarEntregas: async (req, res) => {
        try {

            // Busca todas as entregas na tabela do Banco
            const entregas = await entregaModel.buscarTodas();

            // Retorna sucesso com JSON
            res.status(200).json(entregas);

        } catch (error) {
            console.error("ERRO ao listar entregas:", error);

            // Erro genérico de servidor
            res.status(500).json({ erro: "ERRO interno ao listar entregas!" });
        }
    },

    // -------------------------------------
    // REGISTRAR UMA ENTREGA
    // POST /entregas
    // -------------------------------------
    registrarEntrega: async (req, res) => {
        try {

            // Dados recebidos via corpo da requisição HTTP
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
            //   VALIDAÇÕES DOS CAMPOS
            // -----------------------------

            // Verifica se algum campo obrigatório não foi informado
            if (
                idCliente === undefined || dataPedido === undefined ||
                tipoEntrega === undefined || distanciaKM === undefined ||
                pesoCarga === undefined || valorKM === undefined || valorKG === undefined
            ) {
                return res.status(400).json({ erro: "Campos obrigatórios não foram preenchidos" });
            }

            // Verifica se os campos numéricos são realmente números
            if (isNaN(distanciaKM) || isNaN(pesoCarga) || isNaN(valorKM) || isNaN(valorKG)) {
                return res.status(400).json({ erro: "Campos preenchidos com valores inválidos" });
            }

            // Valida se o ID possui 36 caracteres (UUID v4)
            if (idCliente.length !== 36) {
                return res.status(400).json({ erro: "Id do Cliente inválido" });
            }

            // Verifica se a data recebida é válida
            const data = new Date(dataPedido);
            if (isNaN(data.getTime())) {
                return res.status(400).json({ erro: "Data do pedido inválida" });
            }

            // Verifica se o cliente existe no banco
            const cliente = await clienteModel.buscarUm(idCliente);

            if (!cliente || cliente.length != 1) {
                return res.status(404).json({ erro: "Cliente não encontrado" });
            }

            // -----------------------------
            //   REALIZA OS CÁLCULOS
            // -----------------------------

            // Cálculo simples do valor baseado na distância e peso
            let valorDistancia = distanciaKM * valorKM;
            let valorPeso = pesoCarga * valorKG;

            // Soma dos valores base
            let valorBaseEntrega = valorDistancia + valorPeso;

            // Variáveis de acréscimo, desconto e taxa extra
            let acrescimo = 0;
            let desconto = 0;
            let taxaExtra = 0;

            // Começa com o valor base
            let valorFinal = valorBaseEntrega;

            // Regra 1: Entrega urgente → 20% de acréscimo
            if (tipoEntrega.toLowerCase() === "urgente") {
                acrescimo = valorBaseEntrega * 0.20;
                valorFinal += acrescimo;
            }

            // Regra 2: Peso acima de 50 kg → taxa extra fixa de 15
            if (pesoCarga > 50) {
                taxaExtra = 15;
                valorFinal += taxaExtra;
            }

            // Regra 3: Valor final acima de 500 → desconto de 10%
            if (valorFinal > 500) {
                desconto = valorFinal * 0.10;
                valorFinal -= desconto;
            }

            // -----------------------------
            //   INSERIR PEDIDO + ENTREGA
            // -----------------------------

            const statusEntrega = "calculado";

            // Chama model para registrar no Banco
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
            //   RETORNO PARA O CLIENTE
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
