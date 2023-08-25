const db = require('./db');
const { Sequelize, Model, DataTypes } = require("sequelize");
const Usuario = require("./Usuario");
const Produto = require("./Produto");
		
//Criacao da tabela postagens
const Personalizacao = db.sequelize.define('Personalizacao', 
{
    preco:{
        type: DataTypes.DOUBLE
    },
    especificacoes: {
        type: DataTypes.STRING
    },
    resposta: {
        type: DataTypes.STRING
    },
    dataAprovacao: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.STRING
    },
    imgProposta1: {
        type: DataTypes.STRING
    },
    imgProposta2: {
        type: DataTypes.STRING
    },
    imgProposta3: {
        type: DataTypes.STRING
    },
    usuarioVendedor: {
        type: DataTypes.INTEGER
    },

})

Personalizacao.belongsTo(Produto);

Personalizacao.belongsTo(Usuario);

Personalizacao.sync();

module.exports = Personalizacao;