const db = require('./db');
const { Sequelize, Model, DataTypes } = require("sequelize");
Pedido = require('./Pedido');
Personalizacao = require('./Personalizacao');
Produto = require('./Produto');
		
//Criacao da tabela postagens
const Item = db.sequelize.define('Item',{
    preco:{
        type: DataTypes.DOUBLE
    },
    quantidade: {
        type: DataTypes.INTEGER
    }
})

Item.belongsTo(Produto)
Item.belongsTo(Pedido)
Item.belongsTo(Personalizacao)

Item.sync();

module.exports = Item;