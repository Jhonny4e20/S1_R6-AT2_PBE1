

const express = require("express");
const router = express.Router();

const { registrarEntrega } = require("../controllers/entregaController");


router.post("/entregas", registrarEntrega);

module.exports = router;
