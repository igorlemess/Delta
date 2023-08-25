const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const passport = require("passport");
const configprod = require('../config/produto.js');
const Produto = require('../models/Produto.js');
const path = require('path');
const flash = require("connect-flash");
const Categoria = require('../models/Categoria.js');
const Usuario = require('../models/Usuario.js');
const Item = require('../models/Item.js')
const Endereco = require('../models/Endereco.js');
const Personalizacao = require('../models/Personalizacao.js')
const Pedido = require('../models/Pedido.js')
const Status = require('../models/Status.js')
router.use('/Images', express.static(path.join(__dirname, '../Images')))

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/usuario/login');
}


router.get('/meuspedidos', isAuthenticated, async (req,res) => {
    
    Item.findAll({
        include:[{model:Produto}],
        raw : true,
        nest : true
    }).then(async (Items) => {
        const P = await Pedido.findAll({where:{UsuarioId: req.user.id},order:[['createdAt','desc']],include:[{model:Status}, {model:Endereco}],
        raw : true,
        nest : true})
        res.render('pedidos/pedidos', {items: Items, pedidos: P})
    })
    


    // P.forEach(async (P) =>
    // {
    //     I.push(await Item.findAll(
    //             {where:{PedidoId: P.id},
    //             include:[{model: Produto}],
    //             raw : true,
    //             nest : true}
    //     ))
    // })

    // console.log(P);
    // const I =[];

    // for(var i = 0; i < P.length; i++)
    // {
    //     I.push(await Item.findAll(
    //             {where:{PedidoId: P[i]['id']},
    //             include:[{model: Produto}],
    //             raw : true,
    //             nest : true}
    //             ))
    // }

    // var items = I[0];

    // console.log(items)
//    res.render('pedidos/pedidos',{pedidos: P,items: items});
})


router.get('/vendas', isAuthenticated, async (req,res) => {
    
    Item.findAll({
        include:[{model:Produto}],
        raw : true,
        nest : true
    }).then(async (Items) => {
        const P = await Pedido.findAll({where:{idVendedor: req.user.id},order:[['createdAt','desc']],include:[{model:Status}, {model:Endereco}], 
        raw : true,
        nest : true})
        res.render('pedidos/vendas', {items: Items, pedidos: P})
    })

    console.log(req.body.StatusId);

})


router.post('/alterarStatus', isAuthenticated,  (req,res) => {
    Status.update({
        status: req.body.status
    },
    {where:{id: req.body.StatusId}}).then(function(){
            req.flash("success_msg","Status atualizado!")
            res.redirect('/pedidos/vendas');
        })
})

module.exports = router;
