const express = require("express");
const router = express.Router();
const { entregaController } = require('../controllers/entregaController');

//GET /entregas -> Lista todas as entregas
router.get('/entregas', entregaController.listarEntregas); 

//POST /entregas -> Cadastra uma nova entrega
router.post('/entregas', entregaController.registrarEntrega);

module.exports = { entregaRoutes: router };