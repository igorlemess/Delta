const db = require('./db');
// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

//Criacao da tabela usuarios
const Usuario = db.sequelize.define('Usuario', {
    Nome: { type: db.Sequelize.STRING },
    CPF: { type: db.Sequelize.STRING },
    dataNascimento: { type: db.Sequelize.DATE },
    Telefone: { type: db.Sequelize.STRING },
    Email: { type: db.Sequelize.STRING },
    Senha: { type: db.Sequelize.STRING },
    RG: { type: db.Sequelize.STRING },
    inscricaoEstadual: { type: db.Sequelize.STRING },
    CNPJ: { type: db.Sequelize.STRING },
    razaoSocial: { type: db.Sequelize.STRING },
    instituicao: { type: db.Sequelize.STRING },
    agencia: { type: db.Sequelize.STRING },
    conta: { type: db.Sequelize.STRING },
    instagram: { type: db.Sequelize.STRING },
    facebook: { type: db.Sequelize.STRING },
    site: { type: db.Sequelize.STRING },
    imgPerfil: { type: db.Sequelize.STRING },
  }); 

// const Usuario = new Schema({
//     Nome: { 
//         type: String,
//         required: true
//     },
//     CPF: { 
//         type : String,
//         required: true 
//     },
//     dataNascimento: { 
//         type : Date,
//         required: true 
//     },
//     Telefone: { 
//         type : String,
//         required: true
//     },
//     Email: { 
//         type : String, 
//         required: true
//     },
//     Senha: { 
//         type: String,
//         required: true 
//     },
// });

Usuario.sync();

module.exports = Usuario;
// mongoose.model("Usuario", Usuario);