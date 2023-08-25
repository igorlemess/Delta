const db = require('./db');
const { Sequelize, Model, DataTypes } = require("sequelize");
		
//Criacao da tabela postagens
const Status = db.sequelize.define('Status', {
    status: {
        type: DataTypes.STRING
    }
})

Status.sync()

module.exports = Status;