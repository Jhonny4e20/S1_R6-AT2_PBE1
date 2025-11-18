const { sql, getConnection } = require("../config/db");

const pedidoModel = {

    buscarTodos: async () => {
        try {
            const pool = await getConnection();

            const querySQL = `
                SELECT 
                    P.*, C.nomeCliente
                FROM Pedidos P
                INNER JOIN Clientes C
                    ON C.idCliente = P.idCliente
            `;

            const result = await pool.request().query(querySQL);
            return result.recordset;

        } catch (error) {
            console.error("ERRO ao buscar pedidos:", error);
            throw error;
        }
    },

    buscarUm: async (idPedido) => {
        try {
            const pool = await getConnection();

            const querySQL = `
                SELECT * FROM Pedidos WHERE idPedido = @idPedido
            `;

            const result = await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("ERRO ao buscar pedido:", error);
            throw error;
        }
    },

    inserirPedido: async (
        idCliente,
        dataPedido,
        tipoEntrega,
        distanciaKm,
        pesoCarga,
        valorKm,
        valorKg
    ) => {

        try {
            const pool = await getConnection();

            const querySQL = `
                INSERT INTO Pedidos (
                    idCliente, dataPedido, tipoEntrega,
                    distanciaKm, pesoCarga, valorKm, valorKg
                )
                VALUES (
                    @idCliente, @dataPedido, @tipoEntrega,
                    @distanciaKm, @pesoCarga, @valorKm, @valorKg
                )
            `;

            await pool.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VarChar(10), tipoEntrega)
                .input("distanciaKm", sql.Decimal(10,2), distanciaKm)
                .input("pesoCarga", sql.Decimal(10,2), pesoCarga)
                .input("valorKm", sql.Decimal(10,2), valorKm)
                .input("valorKg", sql.Decimal(10,2), valorKg)
                .query(querySQL);

        } catch (error) {
            console.error("ERRO ao inserir pedido:", error);
            throw error;
        }
    },

    atualizarPedido: async (
        idPedido,
        idCliente,
        dataPedido,
        tipoEntrega,
        distanciaKm,
        pesoCarga,
        valorKm,
        valorKg
    ) => {

        try {
            const pool = await getConnection();

            const querySQL = `
                UPDATE Pedidos
                SET 
                    idCliente = @idCliente,
                    dataPedido = @dataPedido,
                    tipoEntrega = @tipoEntrega,
                    distanciaKm = @distanciaKm,
                    pesoCarga = @pesoCarga,
                    valorKm = @valorKm,
                    valorKg = @valorKg
                WHERE idPedido = @idPedido
            `;

            await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VarChar(10), tipoEntrega)
                .input("distanciaKm", sql.Decimal(10,2), distanciaKm)
                .input("pesoCarga", sql.Decimal(10,2), pesoCarga)
                .input("valorKm", sql.Decimal(10,2), valorKm)
                .input("valorKg", sql.Decimal(10,2), valorKg)
                .query(querySQL);

        } catch (error) {
            console.error("ERRO ao atualizar pedido:", error);
            throw error;
        }
    },

    deletarPedido: async (idPedido) => {
        try {
            const pool = await getConnection();

            const querySQL = `
                DELETE FROM Pedidos WHERE idPedido = @idPedido
            `;

            await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

        } catch (error) {
            console.error("ERRO ao deletar pedido:", error);
            throw error;
        }
    }
};

module.exports = { pedidoModel };
