
// Importa o pacote 'mssql' para conexão com SQL Server
const sql = require("mssql");

// Objeto de configuração da conexão usando variáveis de ambiente (.env)
const config = {
    user: process.env.USER_DB,                // Usuário do banco
    password: process.env.PASSWORD_DB,        // Senha do usuário
    server: process.env.SERVER_DB,            // Host onde o SQL Server está rodando
    database: process.env.DATABASE_DB,        // Nome do banco de dados
    options: {
        encrypt: true,                        // Necessário em ambientes seguros / Azure
        trustServerCertificate: true          // Permite certificados locais (DEV)
    }
};

// Função que abre a conexão com SQL Server e retorna o pool
async function getConnection() {
    try {
        const pool = await sql.connect(config); 
        return pool;

    } catch (error) {
        console.error('ERRO na conexão do SQL Server:', error);
        return null; // Recomendado retornar null em caso de falha
    }
}

// Teste imediato da conexão ao iniciar o arquivo (opcional, mas útil)
(async () => {
    const pool = await getConnection();

    if (pool) {
        console.log("Conexão com o BD realizada com sucesso");
    } else {
        console.log("Falha ao conectar com o banco de dados");
    }
})();

// Exporta o SQL e a função de conexão para uso nos Models
module.exports = { sql, getConnection };
