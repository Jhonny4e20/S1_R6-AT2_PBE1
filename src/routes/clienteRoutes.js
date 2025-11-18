const express = require("express");
const router = express.Router();

// Importa o controller onde estão as regras de negócio
const { clienteController } = require("../controllers/clienteController");

// ======================================================================
// ROTAS DE CLIENTES
// Aqui ficam todas as rotas relacionadas à entidade Clientes
// ======================================================================

/*
    GET /clientes
    - Lista todos os clientes cadastrados
    - Também permite buscar 1 cliente usando ?idCliente=xxxx
*/
router.get("/clientes", clienteController.listarClientes);

/*
    POST /clientes
    - Cadastra um novo cliente
    - Dados enviados no corpo da requisição (JSON)
*/
router.post("/clientes", clienteController.adicionarCliente);

/*
    PUT /clientes/:idCliente
    - Atualiza um cliente existente
    - O ID do cliente é passado pela URL
*/
router.put("/clientes/:idCliente", clienteController.atualizarCliente);

/*
    DELETE /clientes/:idCliente
    - Deleta um cliente pelo ID
*/
router.delete("/clientes/:idCliente", clienteController.deletarCliente);

// Exporta o router para ser usado no arquivo principal (server.js)
module.exports = { clienteRoutes: router };
