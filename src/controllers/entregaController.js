
const sql = require("mssql");
const EntregaModel = require("../models/entregaModel");

async function registrarEntrega(req, res) {
    try {
        const {
            idEntrega,
            idPedido,
            valorDistancia,
            valorPeso,
            acrescimo,
            desconto,
            taxaExtra,
            valorFinal,
            statusEntrega
        } = req.body;

        if (!idEntrega || idPedido || !valorDistancia || !valorPeso || !acrescimo || !desconto || !taxaExtra ||
            !valorFinal || !statusEntrega
        ) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios!"
            });
        }

        // Conexão com BD
        const db = await sql.connect(require("../db/config"));

        // Instancia o model
        const entregaModel = new EntregaModel(db);

        // Registra a entrega + cálculos
        const resultado = await entregaModel.registrarEntrega({
            idEntrega,
            idPedido,
            valorDistancia,
            valorPeso,
            acrescimo,
            desconto,
            taxaExtra,
            valorFinal,
            statusEntrega
        });

        res.status(201).json({
            mensagem: "Entrega registrada com sucesso!",
            dados: resultado
        });

    } catch (error) {
        console.error("Erro ao registrar entrega:", error);
        res.status(500).json({
            erro: "Erro interno ao registrar entrega."
        });
    }
}

module.exports = { registrarEntrega };
