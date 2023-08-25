const db = require('./db');
const { Sequelize, DataTypes } = require('sequelize');
const Usuario = require('./Usuario.js');

// Definir o modelo para a tabela de endereços
const Endereco = db.sequelize.define('Endereco', {
  cep: {
    type: DataTypes.STRING,
    allowNull: false
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  UF: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: false
  },
  complemento: {
    type: DataTypes.STRING,
    allowNull: true
  },
  UserID: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Endereco.belongsTo(Usuario, { foreignKey: 'UserId' });

module.exports = Endereco;