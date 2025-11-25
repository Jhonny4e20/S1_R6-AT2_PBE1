const { sql, getConnection } = require("../config/db"); //importa a configuração do banco de dados

const entregaModel = {

    buscarTodas: async () => { //busca todas as entregas
        try {
            const pool = await getConnection();

            const querySQL = `
                SELECT * FROM Entregas
            `;

            const result = await pool.request().query(querySQL); //executa a consulta
            return result.recordset;
        } catch (error) {
            console.error("ERRO ao buscar entregas:", error);
            throw error;
        }
    }, 

    buscarUma: async (idEntrega) => {
        try {
            const pool = await getConnection();

            const querySQL = `
                SELECT * FROM Entregas WHERE idEntrega = @idEntrega
            `;

            const result = await pool.request()
                .input("idEntrega", sql.UniqueIdentifier, idEntrega)
                .query(querySQL);
            return result.recordset;
        } catch (error) {
            console.error("ERRO ao buscar entrega:", error);
            throw error;
        }
    },

    registrarEntrega: async (

        idEntrega,
        idPedido,
        nomeProduto,
        valorDistancia,
        valorPeso,
        acrescimo,
        desconto,
        taxaExtra,
        valorFinal,
        statusEntrega
        
    ) => {
        try {
            const pool = await getConnection();
            const querySQL = `
                INSERT INTO Entregas (
                    idEntrega,
                    idPedido,
                    nomeProduto,
                    valorDistancia,
                    valorPeso,
                    acrescimo,
                    desconto,
                    taxaExtra,
                    valorFinal,
                    statusEntrega
                )
                VALUES (
                    @idEntrega,
                    @idPedido,
                    @nomeProduto,
                    @valorDistancia,
                    @valorPeso,
                    @acrescimo,
                    @desconto,
                    @taxaExtra,
                    @valorFinal,
                    @statusEntrega
                )
            `;

            await pool.request()
                .input("idEntrega", sql.UniqueIdentifier, idEntrega)
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("nomeProduto", sql.VarChar(100), nomeProduto)
                .input("valorDistancia", sql.Decimal(10, 2), valorDistancia)
                .input("valorPeso", sql.Decimal(10, 2), valorPeso)
                .input("acrescimo", sql.Decimal(10, 2), acrescimo)
                .input("desconto", sql.Decimal(10, 2), desconto)
                .input("taxaExtra", sql.Decimal(10, 2), taxaExtra)
                .input("valorFinal", sql.Decimal(10, 2), valorFinal)
                .input("statusEntrega", sql.VarChar(20), statusEntrega)
                .query(querySQL);
        }

        catch (error) {
            console.error("ERRO ao registrar entrega:", error);
            throw error;
        }
    },

    atualizarStatus: async ( idEntrega, statusEntrega ) => {
        try {
            const pool = await getConnection();
            const querySQL = `
                UPDATE Entregas
                SET statusEntrega = @statusEntrega
                WHERE idEntrega = @idEntrega
            `;

            await pool.request()
                .input("idEntrega", sql.UniqueIdentifier, idEntrega)
                .input("statusEntrega", sql.VarChar(20), statusEntrega)
                .query(querySQL);
        } catch (error) {
            console.error("ERRO ao atualizar status da entrega:", error);
            throw error;
        }
    },

    deletarEntrega: async (idEntrega) => {
        try {
            const pool = await getConnection();
            const querySQL = `
                DELETE FROM Entregas WHERE idEntrega = @idEntrega
            `;
            await pool.request()
                .input("idEntrega", sql.UniqueIdentifier, idEntrega)
                .query(querySQL);
        } catch (error) {
            console.error("ERRO ao deletar entrega:", error);
            throw error;
        }
    }
}

module.exports = { entregaModel };