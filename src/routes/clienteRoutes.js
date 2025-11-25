const express = require("express");
const router = express.Router();
const { clienteController } = require("../controllers/clienteController");

//GET /clientes -> Lista todos os Clientes
router.get("/clientes", clienteController.listarClientes);

//POST /clientes -> Cadastra um novo Cliente
router.post("/clientes", clienteController.adicionarCliente);

//PUT /clientes/:idCliente -> Atualiza um Cliente pelo idCliente
router.put("/clientes/:idCliente", clienteController.atualizarCliente);

//DELETE /clientes/:idCliente -> Deleta um Cliente pelo idCliente
router.delete("/clientes/:idCliente", clienteController.deletarCliente);

module.exports = { clienteRoutes: router};
