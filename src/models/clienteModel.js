const { sql, getConnection } = require("../config/db"); //importa a configuração do banco de dados

const clienteModel = {

    buscarTodos: async () => { //busca todos os clientes
        try {
            const pool = await getConnection();
            const querySQL = "SELECT * FROM Clientes"; //consulta SQL para buscar todos os clientes
            const result = await pool.request().query(querySQL); 
            return result.recordset;
        } catch (error) {
            console.error("ERRO ao buscar todos clientes:", error);
            throw error;
        }
    },

    buscarUm: async (idCliente) => { //busca um cliente pelo idCliente
        try {
            const pool = await getConnection();
            const querySQL = "SELECT * FROM Clientes WHERE idCliente = @idCliente"; //consulta SQL para buscar um cliente pelo idCliente
            const result = await pool.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente) //adiciona o parâmetro idCliente à consulta
                .query(querySQL); //executa a consulta

            return result.recordset;

        } catch (error) {
            console.error("ERRO ao buscar cliente:", error);
            throw error;
        }
    },

    buscarCPF: async (cpfCliente) => { //busca um cliente pelo cpfCliente
        try {
            const pool = await getConnection();
            const querySQL = "SELECT * FROM Clientes WHERE cpfCliente = @cpfCliente"; //consulta SQL para buscar um cliente pelo cpfCliente

            const result = await pool.request() //cria uma requisição ao banco de dados
                .input("cpfCliente", sql.VarChar(11), cpfCliente) //adiciona o parâmetro cpfCliente à consulta
                .query(querySQL);

            return result.recordset;

        } catch (error) {
            console.error("ERRO ao buscar CPF:", error); //log do erro
            throw error;
        }
    },

    inserirCliente: async (nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) => { //insere um novo cliente
        try {
            const pool = await getConnection();
            const querySQL =
                "INSERT INTO Clientes(nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) " +
                "VALUES(@nomeCliente, @cpfCliente, @telefoneCliente, @emailCliente, @enderecoCliente)"; //consulta SQL para inserir um novo cliente

            await pool.request()
                .input("nomeCliente", sql.VarChar(100), nomeCliente) //adiciona os parâmetros à consulta
                .input("cpfCliente", sql.VarChar(11), cpfCliente) //adiciona os parâmetros à consulta
                .input("telefoneCliente", sql.VarChar(20), telefoneCliente) //adiciona os parâmetros à consulta
                .input("emailCliente", sql.VarChar(100), emailCliente) //adiciona os parâmetros à consulta
                .input("enderecoCliente", sql.VarChar(300), enderecoCliente) //adiciona os parâmetros à consulta
                .query(querySQL);

        } catch (error) {
            console.error("ERRO ao inserir cliente:", error);
            throw error;
        }
    },

    atualizarCliente: async (idCliente, nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) => { //atualiza um cliente
        try {
            const pool = await getConnection(); //obtém a conexão com o banco de dados

            const querySQL = `
                UPDATE Clientes
                SET nomeCliente = @nomeCliente,
                    cpfCliente = @cpfCliente,
                    telefoneCliente = @telefoneCliente,
                    emailCliente = @emailCliente,
                    enderecoCliente = @enderecoCliente
                WHERE idCliente = @idCliente
            `; //consulta SQL para atualizar um cliente

            await pool.request() //cria uma requisição ao banco de dados
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

    deletarCliente: async (idCliente) => { //deleta um cliente
        const pool = await getConnection();
        const transaction = new sql.Transaction(pool); //inicia uma transação para garantir a integridade dos dados

        try {
            await transaction.begin(); 

            // EXCLUI pedidos associados antes (se houver FK)
            await transaction.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente) 
                .query("DELETE FROM Pedidos WHERE idCliente = @idCliente");


            await transaction.request()
                .input("idCliente", sql.UniqueIdentifier, idCliente) //adiciona o parâmetro idCliente à consulta
                .query("DELETE FROM Clientes WHERE idCliente = @idCliente"); //deleta o cliente do banco de dados

            await transaction.commit();

        } catch (error) {
            await transaction.rollback(); 
            console.error("Erro ao deletar cliente:", error);
            throw error; //lança o erro para ser tratado pelo chamador
        }
    }

};

module.exports = { clienteModel }; //exporta o clienteModel