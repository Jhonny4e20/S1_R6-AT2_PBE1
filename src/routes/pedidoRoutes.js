const express = require("express");
const router = express.Router();

// Importa o controller responsável pelas regras de negócio dos pedidos
const { pedidoController } = require("../controllers/pedidoController");

/**
 * ======================================================================
 * ROTAS DE PEDIDOS
 * 
 * @module pedidoRoutes
 * 
 * @description
 * Conjunto de rotas responsáveis por gerenciar os pedidos.
 * 
 * - GET /pedidos
 *      → Lista todos os pedidos armazenados no banco de dados.
 * 
 * - POST /pedidos
 *      → Cria um novo pedido com os dados enviados pelo cliente HTTP.
 * 
 * - PUT /pedidos/:idPedido
 *      → Atualiza um pedido existente, buscando-o pelo ID fornecido na URL.
 * 
 * - DELETE /pedidos/:idPedido
 *      → Remove um pedido do sistema pelo ID fornecido na URL.
 * ======================================================================
 */

// Lista todos os pedidos
router.get("/pedidos", pedidoController.listarPedidos);

// Cadastra um novo pedido
router.post("/pedidos", pedidoController.criarPedido);

// Atualiza um pedido existente
router.put("/pedidos/:idPedido", pedidoController.atualizarPedido);

// Deleta um pedido pelo ID
router.delete("/pedidos/:idPedido", pedidoController.deletarPedido);

// Exporta o módulo para ser usado no server.js
module.exports = { pedidoRoutes: router };
