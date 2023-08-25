const Sequelize = require('sequelize'); // conexao com o banco
const sequelize = new Sequelize('delta', 'root', 'sonic2006', {
    host: "localhost",
    dialect: 'mysql',
    query:{raw:true}
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}