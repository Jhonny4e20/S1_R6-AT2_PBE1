const { pedidoModel } = require("../models/pedidoModel");
const { clienteModel } = require("../models/clienteModel");

// Controller responsável por todas as operações relacionadas a Pedidos + cálculos de entrega
const pedidoController = {

    // ---------------------------------------------
    // LISTAR TODOS OS PEDIDOS
    // GET /pedidos
    // ---------------------------------------------
    listarPedidos: async (req, res) => {
        try {

            // Busca todos os pedidos no banco
            const pedidos = await pedidoModel.buscarTodos();

            // Retorna a lista
            res.status(200).json(pedidos);

        } catch (error) {
            console.error("ERRO ao listar pedidos:", error);
            res.status(500).json({ erro: "ERRO interno ao listar pedidos!" });
        }
    },

    // ---------------------------------------------
    // CRIAR UM NOVO PEDIDO
    // POST /pedidos
    // ---------------------------------------------
    criarPedido: async (req, res) => {

        try {

            // Dados enviados pelo cliente via JSON
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
            //        VALIDAÇÕES
            // -----------------------------

            // Verifica se todos os campos essenciais existem
            if (
                idCliente == undefined || dataPedido == undefined ||
                tipoEntrega == undefined || distanciaKM == undefined ||
                pesoCarga == undefined || valorKM == undefined || valorKG == undefined
            ) {
                return res.status(400).json({ erro: "Campos obrigatórios não foram preenchidos" });
            }

            // Verifica se campos numéricos realmente são números
            if (isNaN(distanciaKM) || isNaN(pesoCarga) || isNaN(valorKM) || isNaN(valorKG)) {
                return res.status(400).json({ erro: "Campos preenchidos com valores inválidos" });
            }

            // Valida se o ID possui o tamanho de UUID v4
            if (idCliente.length != 36) {
                return res.status(400).json({ erro: "Id do Cliente inválido" });
            }

            // Verificação da data
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
            //          CÁLCULOS
            // -----------------------------

            // Cálculo do valor baseado na distância e peso
            let valorDistancia = distanciaKM * valorKM;
            let valorPeso = pesoCarga * valorKG;

            // Soma inicial
            let valorBaseEntrega = valorDistancia + valorPeso;

            // Variáveis auxiliares
            let acrescimo = 0;
            let desconto = 0;
            let taxaExtra = 0;

            // Começa com o valor base
            let valorFinal = valorBaseEntrega;

            // URGENTE = 20% a mais
            if (tipoEntrega.toLowerCase() === "urgente") {
                acrescimo = valorBaseEntrega * 0.20;
                valorFinal += acrescimo;
            }

            // +15 reais se peso > 50kg
            if (pesoCarga > 50) {
                taxaExtra = 15;
                valorFinal += taxaExtra;
            }

            // 10% de desconto se valor > 500
            if (valorFinal > 500) {
                desconto = valorFinal * 0.10;
                valorFinal -= desconto;
            }

            const statusEntrega = "calculado";

            // -----------------------------
            //   REGISTRO FINAL NO BANCO
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
            //   RETORNO PARA O CLIENTE
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

    // ---------------------------------------------
    // ATUALIZAR UM PEDIDO
    // PUT /pedidos/:idPedido
    // ---------------------------------------------
    atualizarPedido: async (req, res) => {
        try {

            // ID do pedido enviado pela URL
            const { idPedido } = req.params;

            // Dados opcionais enviados na requisição
            const {
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKM,
                pesoCarga,
                valorKM,
                valorKG,
                statusEntrega
            } = req.body;

            // Valida ID do pedido
            if (idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido!" });
            }

            // Busca se existe o pedido
            const pedido = await pedidoModel.buscarUm(idPedido);

            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado!" });
            }

            // Se enviou idCliente → valida novamente
            if (idCliente) {
                if (idCliente.length !== 36) {
                    return res.status(400).json({ erro: "ID do cliente inválido!" });
                }

                const cliente = await clienteModel.buscarUm(idCliente);
                if (!cliente || cliente.length !== 1) {
                    return res.status(404).json({ erro: "Cliente não encontrado!" });
                }
            }

            // Dados atuais do pedido antes da atualização
            const pedidoAtual = pedido[0];

            // Se veio no body → usa o novo valor, se não → mantém o antigo
            const idClienteAtualizado = idCliente ?? pedidoAtual.idCliente;
            const dataPedidoAtualizado = dataPedido ?? pedidoAtual.dataPedido;
            const tipoEntregaAtualizado = tipoEntrega ?? pedidoAtual.tipoEntrega;
            const distanciaKMAtualizado = distanciaKM ?? pedidoAtual.distanciaKM;
            const pesoCargaAtualizado = pesoCarga ?? pedidoAtual.pesoCarga;
            const valorKMAtualizado = valorKM ?? pedidoAtual.valorKM;
            const valorKGAtualizado = valorKG ?? pedidoAtual.valorKG;
            const statusEntregaAtualizado = statusEntrega ?? pedidoAtual.statusEntrega;

            // -----------------------------
            //         REFAZ CÁLCULOS
            // -----------------------------
            let valorDistancia = distanciaKMAtualizado * valorKMAtualizado;
            let valorPeso = pesoCargaAtualizado * valorKGAtualizado;

            let valorBaseEntrega = valorDistancia + valorPeso;

            let acrescimo = 0;
            let desconto = 0;
            let taxaExtra = 0;

            let valorFinal = valorBaseEntrega;

            // Urgente
            if (tipoEntregaAtualizado.toLowerCase() === "urgente") {
                acrescimo = valorBaseEntrega * 0.20;
                valorFinal += acrescimo;
            }

            // Peso > 50kg
            if (pesoCargaAtualizado > 50) {
                taxaExtra = 15;
                valorFinal += taxaExtra;
            }

            // Desconto > 500
            if (valorFinal > 500) {
                desconto = valorFinal * 0.10;
                valorFinal -= desconto;
            }

            // Atualiza no banco
            await pedidoModel.atualizarPedido(
                idPedido,
                idClienteAtualizado,
                dataPedidoAtualizado,
                tipoEntregaAtualizado,
                distanciaKMAtualizado,
                pesoCargaAtualizado,
                valorKMAtualizado,
                valorKGAtualizado,
                valorPeso,
                desconto,
                acrescimo,
                taxaExtra,
                valorFinal,
                statusEntregaAtualizado,
                valorDistancia
            );

            res.status(200).json({ mensagem: "Pedido e Entrega atualizados com sucesso!" });

        } catch (error) {
            console.error("ERRO ao atualizar pedido:", error);
            res.status(500).json({ erro: "Erro interno ao atualizar pedido!" });
        }
    },

    // ---------------------------------------------
    // DELETAR UM PEDIDO
    // DELETE /pedidos/:idPedido
    // ---------------------------------------------
    deletarPedido: async (req, res) => {
        try {

            const { idPedido } = req.params;

            // Valida ID
            if (idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido!" });
            }

            // Verifica se existe
            const pedido = await pedidoModel.buscarUm(idPedido);

            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado!" });
            }

            // Deleta no banco
            await pedidoModel.deletarPedido(idPedido);

            res.status(200).json({ mensagem: "Pedido e Entrega deletados com sucesso!" });

        } catch (error) {
            console.error("ERRO ao deletar pedido:", error);
            res.status(500).json({ erro: "Erro interno ao deletar pedido!" });
        }
    }
}

module.exports = { pedidoController };
