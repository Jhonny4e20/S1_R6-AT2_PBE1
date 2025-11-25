const express = require("express");
const router = express.Router();
const { entregaController } = require('../controllers/entregaController');

//GET /entregas -> Lista todas as entregas
router.get('/entregas', entregaController.listarEntregas); 

//POST /entregas -> Cadastra uma nova entrega
router.post('/entregas', entregaController.registrarEntrega);

//PUT /entregas/:idEntrega -> Atualiza uma entrega pelo idEntrega
router.put('/entregas/:idEntrega', entregaController.atualizarEntrega);

//DELETE /entregas/:idEntrega -> Deleta uma entrega pelo idEntrega
router.delete('/entregas/:idEntrega', entregaController.deletarEntrega);

module.exports = { entregaRoutes: router };