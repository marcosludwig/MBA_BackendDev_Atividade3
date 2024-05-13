const mongoose = require('mongoose');

async function connectToDatabase() {
  try {
    const connectionString = 'mongodb://localhost:27017/teste';
    const options = {
      autoIndex: false,        // desabilita criação automática de index para melhorar desempenho
      bufferCommands: false,   // desabilita bufferização de comandos para reduzir uso de memória
      connectTimeoutMS: 30000, // seta timeout de conexão em 30 seconds
      socketTimeoutMS: 30000,  // seta timeout de socket em 30 seconds
    };

    await mongoose.connect(connectionString, options);
    console.log("MongoDB conectado!");
  } catch (err) {
    console.error(`erro na conexão com o banco: ${err}`);
    throw err;
  }
}

module.exports = connectToDatabase;