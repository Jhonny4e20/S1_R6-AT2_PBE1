const { sql, getConnection } = require("../config/db")

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
            console.error("Erro ao buscar pedidos", error);
            throw error;
        }
    },

    buscarUm: async (idPedido) => {
        try {
            const pool = await getConnection();

            const querySQL = "SELECT * FROM PEDIDOS WHERE idPedido = @idPedido";

            const result = await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar pedidos", error);
            throw error;
        }
    },

    inserirPedidos: async (
        idCliente, dataPedido, tipoEntrega,
        distanciaKM, pesoCarga, valorKM, valorKG,
        valorDistancia, valorPeso, valorFinal,
        acrescimo, desconto, taxaExtra, statusEntrega
    ) => {

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {

            // INSERT PEDIDO
            let querySQL = `
            INSERT INTO Pedidos (
                idCliente, dataPedido, tipoEntrega, distanciaKM, pesoCarga, valorKM, valorKG
            )
            OUTPUT INSERTED.idPedido
            VALUES (
                @idCliente, @dataPedido, @tipoEntrega, @distanciaKM, @pesoCarga, @valorKM, @valorKG
            )
            `

            const result = await transaction.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.DateTime, dataPedido)
                .input("tipoEntrega", sql.VarChar(10), tipoEntrega)
                .input("distanciaKM", sql.Decimal(10, 2), distanciaKM)
                .input("pesoCarga", sql.Decimal(10, 2), pesoCarga)
                .input("valorKM", sql.Decimal(10, 2), valorKM)
                .input("valorKG", sql.Decimal(10, 2), valorKG)
                .query(querySQL);

            const idPedido = result.recordset[0].idPedido;

            // INSERT ENTREGA
            querySQL = `
            INSERT INTO ENTREGAS(
                idPedido, valorDistancia, valorPeso, valorFinal,
                acrescimo, desconto, taxaExtra, statusEntrega
            )
            VALUES (
                @idPedido, @valorDistancia, @valorPeso, @valorFinal,
                @acrescimo, @desconto, @taxaExtra, @statusEntrega
            )
            `;

            await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("valorDistancia", sql.Decimal(10, 2), valorDistancia)
                .input("valorPeso", sql.Decimal(10, 2), valorPeso)
                .input("valorFinal", sql.Decimal(10, 2), valorFinal)
                .input("acrescimo", sql.Decimal(10, 2), acrescimo)
                .input("desconto", sql.Decimal(10, 2), desconto)
                .input("taxaExtra", sql.Decimal(10, 2), taxaExtra)
                .input("statusEntrega", sql.VarChar(12), statusEntrega)
                .query(querySQL);

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            console.error("Erro ao inserir pedido", error);
            throw error;
        }
    },

    // CORRIGIDO: agora recebe idPedido corretamente
    atualizarPedido: async (
        idPedido, idCliente, dataPedido, tipoEntrega,
        distanciaKM, pesoCarga, valorKM, valorKG
    ) => {

        try {
            const pool = await getConnection();

            const querySQL = `
            UPDATE PEDIDOS
            SET 
                idCliente = @idCliente,
                dataPedido = @dataPedido,
                tipoEntrega = @tipoEntrega,
                distanciaKM = @distanciaKM,
                pesoCarga = @pesoCarga,
                valorKM = @valorKM,
                valorKG = @valorKG
            WHERE idPedido = @idPedido
            `;

            await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.DateTime, dataPedido)
                .input("tipoEntrega", sql.VarChar(10), tipoEntrega)
                .input("distanciaKM", sql.Decimal(10, 2), distanciaKM)
                .input("pesoCarga", sql.Decimal(10, 2), pesoCarga)
                .input("valorKM", sql.Decimal(10, 2), valorKM)
                .input("valorKG", sql.Decimal(10, 2), valorKG)
                .query(querySQL);

        } catch (error) {
            console.error("Erro ao atualizar pedido", error);
            throw error;
        }
    },

    deletarPedido: async (idPedido) => {

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {

            // Remove entregas primeiro (evita erro de FK)
            let querySQL = `
                DELETE FROM ENTREGAS
                WHERE idPedido = @idPedido
            `;

            await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            // Depois remove o pedido
            querySQL = `
                DELETE FROM PEDIDOS
                WHERE idPedido = @idPedido
            `;

            await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .query(querySQL);

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            console.error("Erro ao deletar Pedido:", error);
            throw error;
        }
    }
}

module.exports = { pedidoModel }
