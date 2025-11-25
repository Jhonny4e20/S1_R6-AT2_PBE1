/*const { sql, getConnection } = require("../config/db"); //importa a configuração do banco de dados

const pedidoModel = {

    buscarTodos: async () => { //busca todos os pedidos
        try {
            const pool = await getConnection();

            const querySQL = `
                SELECT 
                    P.*, C.nomeCliente
                FROM Pedidos P
                INNER JOIN Clientes C
                    ON C.idCliente = P.idCliente
            `; //consulta SQL para buscar todos os pedidos com o nome do cliente associado

            const result = await pool.request().query(querySQL); //executa a consulta
            return result.recordset;

        } catch (error) {
            console.error("ERRO ao buscar pedidos:", error); //log do erro
            throw error;
        }
    },

    buscarUm: async (idPedido) => {
        try {
            const pool = await getConnection(); //obtém a conexão com o banco de dados

            const querySQL = `
                SELECT * FROM Pedidos WHERE idPedido = @idPedido
            `; //consulta SQL para buscar um pedido pelo idPedido

            const result = await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido) //adiciona o parâmetro idPedido à consulta
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("ERRO ao buscar pedido:", error); //log do erro
            throw error;
        }
    },

    inserirPedido: async ( idCliente, dataPedido, tipoEntrega, distanciaKm, pesoCarga, valorKm, valorKg ) => {

        try {
            const pool = await getConnection(); //obtém a conexão com o banco de dados

            const querySQL = `
                INSERT INTO Pedidos (
                    idCliente, dataPedido, tipoEntrega,
                    distanciaKm, pesoCarga, valorKm, valorKg
                )
                VALUES (
                    @idCliente, @dataPedido, @tipoEntrega,
                    @distanciaKm, @pesoCarga, @valorKm, @valorKg
                )
            `; //consulta SQL para inserir um novo pedido

            await pool.request() //cria uma requisição ao banco de dados
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VarChar(10), tipoEntrega)
                .input("distanciaKm", sql.Decimal(10,2), distanciaKm)
                .input("pesoCarga", sql.Decimal(10,2), pesoCarga)
                .input("valorKm", sql.Decimal(10,2), valorKm)
                .input("valorKg", sql.Decimal(10,2), valorKg)
                .query(querySQL);//insere o pedido no banco de dados

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
            const pool = await getConnection(); //obtém a conexão com o banco de dados

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
            `; //consulta SQL para atualizar um pedido

            await pool.request() //cria uma requisição ao banco de dados
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VarChar(10), tipoEntrega)
                .input("distanciaKm", sql.Decimal(10,2), distanciaKm)
                .input("pesoCarga", sql.Decimal(10,2), pesoCarga)
                .input("valorKm", sql.Decimal(10,2), valorKm)
                .input("valorKg", sql.Decimal(10,2), valorKg)
                .query(querySQL); //atualiza o pedido no banco de dados

        } catch (error) {
            console.error("ERRO ao atualizar pedido:", error);
            throw error;
        }
    },

    deletarPedido: async (idPedido) => { //deleta um pedido
        try {
            const pool = await getConnection(); //obtém a conexão com o banco de dados

            const querySQL = `
                DELETE FROM Pedidos WHERE idPedido = @idPedido
            `;

            await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido) //adiciona o parâmetro idPedido à consulta
                .query(querySQL);

        } catch (error) {
            console.error("ERRO ao deletar pedido:", error);
            throw error; //lança o erro para ser tratado pelo chamador
        }
    }
};

module.exports = { pedidoModel }; //exporta o pedidoModel
*/

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

            const result = await pool.request()
                .query(querySQL);

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

    inserirPedidos: async (idCliente, dataPedido, tipoEntrega, distanciaKm, pesoCarga, valorKm, valorKg, valorDistanciaEntrega, valorPesoEntrega, valorFinalEntrega, acrescimoEntrega, descontoEntrega, taxaExtraEntrega, statusEntrega) => {

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {

            let querySQL = `
            INSERT INTO Pedidos (idCliente, dataPedido, tipoEntrega, distanciaKm, pesoCarga, valorKm, valorKg)
            OUTPUT INSERTED.idPedido
            VALUES (@idCliente, @dataPedido, @tipoEntrega, @distanciaKm, @pesoCarga, @valorKm, @valorKg)
            `
            
            const result = await transaction.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VarChar(10), tipoEntrega)
                .input("distanciaKm", sql.Decimal(10,2), distanciaKm)
                .input("pesoCarga", sql.Decimal(10,2), pesoCarga)
                .input("valorKm", sql.Decimal(10,2), valorKm)
                .input("valorKg", sql.Decimal(10,2), valorKg)
                .query(querySQL); 

            
            const idPedido = result.recordset[0].idPedido;
                querySQL = `
            INSERT INTO ENTREGAS(
                idPedido,
                valorDistanciaEntrega,
                valorPesoEntrega,
                valorFinalEntrega,
                acrescimoEntrega,
                descontoEntrega,
                taxaExtraEntrega,
                statusEntrega
                )
            VALUES(
                @idPedido,
                @valorDistanciaEntrega,
                @valorPesoEntrega,
                @valorFinalEntrega,
                @acrescimoEntrega,
                @descontoEntrega,
                @taxaExtraEntrega,
                @statusEntrega
            )
            `
            await transaction.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("valorDistanciaEntrega", sql.Decimal(10, 2), valorDistanciaEntrega)
                .input("valorPesoEntrega", sql.Decimal(10, 2), valorPesoEntrega)
                .input("valorFinalEntrega", sql.Decimal(10, 2), valorFinalEntrega)
                .input("acrescimoEntrega", sql.Decimal(10, 2), acrescimoEntrega)
                .input("descontoEntrega", sql.Decimal(10, 2), descontoEntrega)
                .input("taxaExtraEntrega", sql.Decimal(10, 2), taxaExtraEntrega)
                .input("statusEntrega", sql.VarChar(12), statusEntrega)
                .query(querySQL)


            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.error("Erro ao inserir pedido", error)
            throw error;
        }
    },

    atualizarPedido: async (idCliente, dataPedido, tipoEntrega, distanciaKm, pesoCarga, valorKm, valorKg) => {

        try {
            const pool = await getConnection();

            const querySQL = `
            UPDATE PEDIDOS
            SET idCliente = @idCliente,
                dataPedido = @dataPedido,
                tipoEntrega = @tipoEntrega, 
                distanciaKm = @distanciaKm,
                pesoCarga = @pesoCarga,
                valorKm = @valorKm,
                valorKg = @valorKg
            WHERE idPedido = @idPedido
            `

            await pool.request()

                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VarChar(10), tipoEntrega)
                .input("distanciaKm", sql.Decimal(10,2), distanciaKm)
                .input("pesoCarga", sql.Decimal(10,2), pesoCarga)
                .input("valorKm", sql.Decimal(10,2), valorKm)
                .input("valorKg", sql.Decimal(10,2), valorKg)
                .query(querySQL)

        } catch (error) {
            console.error("Erro ao inserir pedido", error)
            throw error;
        }

    },

    deletarPedido: async (idPedido) => {

        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {

            let querySQL = `
                DELETE FROM PEDIDOS
                WHERE idPedido = @idPedido
            `

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