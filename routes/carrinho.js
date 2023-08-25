const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const passport = require("passport");
const configprod = require('../config/produto.js');
const mercadopago = require('mercadopago');
const Produto = require('../models/Produto.js');
const path = require('path');
const Item = require('../models/Item.js')
const Status = require('../models/Status.js')
const Pedido = require('../models/Pedido.js')
const Endereco = require('../models/Endereco.js');
router.use('/Images', express.static(path.join(__dirname, '../Images')));

mercadopago.configure({
     access_token: "TEST-7725641336492975-061712-95d8796b0f5ee33f3421ee21725aba3d-322688588",
 });

 function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/usuario/login');
}


router.get("/carrinho", isAuthenticated, (req, res) => {

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

router.post('/adicionarCarrinho', isAuthenticated, async function(req, res) {
    var p = req.body.produtopreco;
    var q = req.body.qtde2;
    var precoItem = p * q;

    var endereco = await Endereco.findOne({ where: { UserId: req.user.id } })

    Pedido.findOne({
      where: { UsuarioId: req.user.id },
      include: [{ model: Status, where: { status: "Processando" } }],
      raw: true,
      nested: true
    }).then(async (pedido) => {
      if (endereco) { // Verifica se o usuário tem um endereço cadastrado
        if (pedido) {
          Item.create({
            quantidade: req.body.qtde2,
            ProdutoId: req.body.produto,
            PedidoId: pedido.id,
            preco: precoItem
          }).then(function() {
            res.redirect('/carrinho/carrinho');
          }).catch(function(erro) {
            req.flash("error_msg", "Houve um erro ao adicionar o item 1");
            res.redirect("/");
          });
        } else {
          Status.create({
            status: "Processando"
          }).then(async (S) => {
            Pedido.create({
              idVendedor: req.body.vendedor,
              UsuarioId: req.user.id,
              ProdutoId: req.body.produto,
              StatusId: S.id,
              DataHora: sequelize.fn('NOW'),
              EnderecoId: endereco.id
            }).then((Pedido) => {
              Item.create({
                quantidade: req.body.qtde2,
                ProdutoId: req.body.produto,
                PedidoId: Pedido.id,
                preco: precoItem
              })
            })
          }).then(function() {
            req.flash("success_msg", "Item adicionado ao carrinho !")
            res.redirect('/carrinho/carrinho');
          }).catch(function(erro) {
            req.flash("error_msg", "Houve um erro ao adicionar o item 2");
            res.redirect("/");
          });
        }
      } else {
        req.flash("error_msg", "Cadastre um endereço");
        res.redirect('/usuario/alterarendereco'); // Redireciona para a página "alterarendereco"
      }
    })
  })
  

router.post("/finalizarPedido",isAuthenticated, (req,res) => {
    console.log(req.body.valorTotal)
    console.log(req.body.pedidoId)
    console.log(req.body.StatusId)

    Pedido.update({
        valortotal: req.body.valorTotal,
        DataHora: sequelize.fn("NOW")
    },{where:{id: req.body.pedidoId}}).then((pedido) =>{
        console.log(pedido);

        Status.update({
            status: "Em produção"
        },{where:{id: req.body.StatusId}}).then((status) => {
            console.log(status);
        })
    }).then(function(){
        req.flash("success_msg","Seu pedido foi finalizado!")
        res.redirect('/');
    }).catch((error) => {
        req.flash("error_msg","Ocorreu um problema ao finalizar seu pedido")
        res.redirect('/');
    })

 
})

router.post("/removerItem",(req,res) => {
    Item.destroy({where:{id: req.body.ItemId}}).then(()=>{
        res.redirect("/carrinho/carrinho")
    }).catch((error)=>{
         req.flash("error_msg", "Houve um erro ao excluir o item")
    })
})




router.post("/create_preference", (req, res) => {
    let preference = {
        items: [
            {
                title: req.body.description,
                unit_price: Number(req.body.price),
                quantity: Number(req.body.quantity),
            },
        ],
        back_urls: {
            success: "http://localhost:8081",
            failure: "http://localhost:8081/carrinho/carrinho",
            pending: "",
        },
        auto_return: "approved",
    };

    mercadopago.preferences
        .create(preference)
        .then(function (response) {
            const preferenceId = response.body.id;

            Pedido.update(
                {
                    valortotal: Number(req.body.price),
                    DataHora: sequelize.fn("NOW"),
                },
                { where: { id: req.body.pedidoId } }
            )
                .then(() => {
                    Status.update(
                        { status: "Em produção" },
                        { where: { id: req.body.StatusId } }
                    )
                        .then(() => {
                            req.flash("success_msg", "Seu pedido foi finalizado!");
                            res.json({ id: preferenceId });
                        })
                        .catch((error) => {
                            console.error(error);
                            req.flash(
                                "error_msg",
                                "Ocorreu um problema ao finalizar seu pedido"
                            );
                            res.status(500).json({
                                error: "Erro ao atualizar o status do pedido",
                            });
                        });
                })
                .catch((error) => {
                    console.error(error);
                    req.flash(
                        "error_msg",
                        "Ocorreu um problema ao finalizar seu pedido"
                    );
                    res.status(500).json({ error: "Erro ao atualizar o pedido" });
                });
        })
        .catch(function (error) {
            console.log(error);
            res
                .status(500)
                .json({ error: "Erro ao criar a preferência no Mercado Pago" });
        });
});


router.get("/feedback", function (req, res) {
    res.json({
        Payment: req.query.payment_id,
        Status: req.query.status,
        MerchantOrder: req.query.merchant_order_id,
    });
});


module.exports = router;

