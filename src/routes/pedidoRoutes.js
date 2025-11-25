const express = require("express");
const router = express.Router();
const {pedidoController} = require("../controllers/pedidoController");

/**
 * Define as rotas relacionadas aos pedidos
 * 
 * @module pedidoRoutes
 * 
 * @description
 * -GET/pedidos -> Lista todos os pedidos do banco de dados.
 * -POST/pedidos -> Cria um novo pedido e os seus itens com os dados enviados pelo cliente HTTP
 */
router.get("/pedidos", pedidoController.listarPedidos);

//POST /pedidos -> Cadastra um novo Pedido
router.post("/pedidos", pedidoController.criarPedido);

//PUT /pedidos/:idPedido -> Atualiza um Pedido pelo idPedido
router.put("/pedidos/:idPedido", pedidoController.atualizarPedido);

//DELETE /pedidos/:idPedido -> Deleta um Pedido pelo idPedido
router.delete("/pedidos/:idPedido", pedidoController.deletarPedido);

module.exports = { pedidoRoutes: router };