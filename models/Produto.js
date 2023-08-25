const db = require('./db');
const { Sequelize, Model, DataTypes } = require("sequelize");
Usuario = require('./Usuario.js');
Categoria = require('./Categoria.js')
		
//Criacao da tabela postagens
const Produto = db.sequelize.define('Produto', {
    nomeProd:{
        type: DataTypes.STRING
    },
    categoria: {
        type: DataTypes.STRING
    },
    preco: {
        type: DataTypes.DOUBLE
    },
    descricao: {
        type: DataTypes.TEXT
    },
    imagem1: {
        type: DataTypes.STRING
    },
    imagem2: {
        type: DataTypes.STRING
    },
    imagem3: {
        type: DataTypes.STRING
    }, 
    qtde: {
        type: DataTypes.INTEGER
    }
})

Categoria.hasMany(Produto);

Usuario.hasMany(Produto);

Produto.sync();

module.exports = Produto;