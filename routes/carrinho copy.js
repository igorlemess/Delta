const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const Produto = require('../models/Produto.js');
const path = require('path');
const Item = require('../models/Item.js')
const Status = require('../models/Status.js')
const Pedido = require('../models/Pedido.js')
router.use('/Images', express.static(path.join(__dirname, '../Images')));

// mercadopago.configure({
//     access_token: "TEST-7725641336492975-061712-95d8796b0f5ee33f3421ee21725aba3d-322688588",
// });

router.get("/carrinho", (req, res) => {


    if(req.query.produto){
        const produtoId = req.query.produto;
        Produto.findOne({ where: { id: produtoId } })
        .then((produto) => {
            if (!produto) {
                return res.status(404).send("Produto não encontrado");
            }
            res.render('produtos/carrinho', { produto: produto });
        })
        .catch((error) => {
            console.error(error);
        });
    }
    else{
        Item.findAll({
            include:[{model:Produto}],
            raw : true,
            nest : true
        }).then(async (Items) => {
            const P = await Pedido.findAll({where:{UsuarioId: req.user.id}, include:[{model:Status, where:{status:"Processando"}}],
                raw : true,
                nest : true})
            res.render('produtos/carrinho', {items: Items, pedidos: P})
        })
    }
})

// router.post("/create_preference", (req, res) => {
//     let preference = {
//         items: [
//             {
//                 title: req.body.description,
//                 unit_price: Number(req.body.price),
//                 quantity: Number(req.body.quantity),
//             },
//         ],
//         back_urls: {
//             success: "http://localhost:8081",
//             failure: "http://localhost:8081",
//             pending: "",
//         },
//         auto_return: "approved",
//     };

//     mercadopago.preferences
//         .create(preference)
//         .then(function (response) {
//             res.json({
//                 id: response.body.id,
//             });
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// });

// router.get("/feedback", function (req, res) {
//     res.json({
//         Payment: req.query.payment_id,
//         Status: req.query.status,
//         MerchantOrder: req.query.merchant_order_id,
//     });
// });


module.exports = router;