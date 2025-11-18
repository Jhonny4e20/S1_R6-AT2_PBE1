
const { sql, getConnection } = require("../config/db");

const clienteModel = {

    buscarTodos: async () => {
        try {
            const pool = await getConnection();
            const querySQL = "SELECT * FROM Clientes";
            const result = await pool.request().query(querySQL);
            return result.recordset;
        } catch (error) {
            console.error("ERRO ao buscar todos clientes:", error);
            throw error;
        }
    },

    buscarUm: async (idCliente) => {
        try {
            const pool = await getConnection();
            const querySQL = "SELECT * FROM Clientes WHERE idCliente = @idCliente";

            const result = await pool.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("ERRO ao buscar cliente:", error);
            throw error;
        }
    },

    buscarCPF: async (cpfCliente) => {
        try {
            const pool = await getConnection();
            const querySQL = "SELECT * FROM Clientes WHERE cpfCliente = @cpfCliente";

            const result = await pool.request()
                .input("cpfCliente", sql.VarChar(11), cpfCliente)
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("ERRO ao buscar CPF:", error);
            throw error;
        }
    },

    inserirCliente: async (nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) => {
        try {
            const pool = await getConnection();
            const querySQL =
                "INSERT INTO Clientes(nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) " +
                "VALUES(@nomeCliente, @cpfCliente, @telefoneCliente, @emailCliente, @enderecoCliente)";

            await pool.request()
                .input("nomeCliente", sql.VarChar(100), nomeCliente)
                .input("cpfCliente", sql.VarChar(11), cpfCliente)
                .input("telefoneCliente", sql.VarChar(20), telefoneCliente)
                .input("emailCliente", sql.VarChar(100), emailCliente)
                .input("enderecoCliente", sql.VarChar(300), enderecoCliente)
                .query(querySQL);

        } catch (error) {
            console.error("ERRO ao inserir cliente:", error);
            throw error;
        }
    },

    atualizarCliente: async (idCliente, nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) => {
        try {
            const pool = await getConnection();

            const querySQL = `
                UPDATE Clientes
                SET nomeCliente = @nomeCliente,
                    cpfCliente = @cpfCliente,
                    telefoneCliente = @telefoneCliente,
                    emailCliente = @emailCliente,
                    enderecoCliente = @enderecoCliente
                WHERE idCliente = @idCliente
            `;

            await pool.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("nomeCliente", sql.VarChar(100), nomeCliente)
                .input("cpfCliente", sql.VarChar(11), cpfCliente)
                .input("telefoneCliente", sql.VarChar(20), telefoneCliente)
                .input("emailCliente", sql.VarChar(100), emailCliente)
                .input("enderecoCliente", sql.VarChar(300), enderecoCliente)
                .query(querySQL);

        } catch (error) {
            console.error("ERRO ao atualizar cliente:", error);
            throw error;
        }
    },

    deletarCliente: async (idCliente) => {
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool);

        try {
            await transaction.begin();

            // EXCLUI pedidos associados antes (se houver FK)
            await transaction.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .query("DELETE FROM Pedidos WHERE idCliente = @idCliente");


            await transaction.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .query("DELETE FROM Clientes WHERE idCliente = @idCliente");

            await transaction.commit();

        } catch (error) {
            await transaction.rollback();
            console.error("Erro ao deletar cliente:", error);
            throw error;
        }
    }

};

module.exports = { clienteModel };
