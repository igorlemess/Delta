const db = require('./db');
const { Sequelize, Model, DataTypes } = require("sequelize");
		
//Criacao da tabela postagens
const Categoria = db.sequelize.define('Categoria', {
    categoria: {
        type: DataTypes.STRING
    }
})


Categoria.sync();

module.exports = Categoria;