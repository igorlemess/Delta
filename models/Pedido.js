const db = require('./db');
const { Sequelize, Model, DataTypes } = require("sequelize");
Endereco = require('./Endereco');
Status = require('./Status');
Usuario = require('./Usuario');
		
//Criacao da tabela postagens
const Pedido = db.sequelize.define('Pedido', {
    valortotal:{
        type: DataTypes.DOUBLE
    },
    prazoentrega: {
        type: DataTypes.STRING
    },
    statuspagamento: {
        type: DataTypes.STRING
    },
    DataHora: {
        type: DataTypes.DATE
    },
    idVendedor:{
        type: DataTypes.INTEGER
    }
})

Pedido.belongsTo(Endereco);
Pedido.belongsTo(Status);
Pedido.belongsTo(Usuario);

Pedido.sync()

module.exports = Pedido;