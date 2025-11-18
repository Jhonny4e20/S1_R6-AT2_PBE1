
const sql = require("mssql");

const config = {
    user: process.env.USER_DB,                
    password: process.env.PASSWORD_DB,     
    server: process.env.SERVER_DB,       
    database: process.env.DATABASE_DB,        
    options: {
        encrypt: true,               
        trustServerCertificate: true 
    }
}

async function getConnection() {
    try {
        const pool = await sql.connect(config);

        return pool;

    } catch (error) {
        console.error('ERRO na conexão do SQL Server:', error);
    }
}

(async () => {
    const pool = await getConnection();

    if (pool) {
        console.log("Conexão com o BD realizada com sucesso");
    }
})();

module.exports = { sql, getConnection };


