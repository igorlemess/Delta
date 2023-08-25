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
const Personalizacao = require('../models/Personalizacao.js')
const Pedido = require('../models/Pedido.js')
const Status = require('../models/Status.js')
router.use('/Images', express.static(path.join(__dirname, '../Images')))


// Propostas Cliente
router.get('/enviar', (req, res) => 
{
    Produto.findOne({where:{id: req.query.produto}}).then((produto) => {
        res.render('propostas/enviar',{produto: produto,vendedor: req.query.vendedor, qtde: req.query.qtde});
    })
});


router.post('/cadProposta', configprod.upload, (req, res) => {
    let errors = [];

    if (!req.body.espProposta || typeof req.body.espProposta == null || typeof req.body.espProposta == undefined || typeof req.body.espProposta == Number) errors.push({ text: "Especificacoes inválidas" });

    if (errors.length > 0) {

    } else {

        const novaPersonalizacao = {
            especificacoes: req.body.espProposta,
            usuarioVendedor: req.body.vendedor,
            UsuarioId: req.user.id,
            ProdutoId: req.body.produto,
            status: "Aguardando resposta do vendedor"
        };

        if (req.files['imagem1']) {
            novaPersonalizacao.imgProposta1 = req.files['imagem1'][0].path;
        }
        if (req.files['imagem2']) {
            novaPersonalizacao.imgProposta2 = req.files['imagem2'][0].path;
        }
        if (req.files['imagem3']) {
            novaPersonalizacao.imgProposta3 = req.files['imagem3'][0].path;
        }

        Personalizacao.create(novaPersonalizacao)
            .then((P) => {
                Item.create({
                    quantidade: req.body.qtde,
                    ProdutoId: req.body.produto,
                    PersonalizacaoId: P.id
                }).then(function () {
                    res.flash("success_msg", "Proposta enviada com sucesso!");
                    res.redirect('/');
                }).catch(function (erro) {
                    req.flash("error_msg", "Houve um erro ao criar item");
                    res.redirect("/");
                });
            }).catch(function (erro) {
                req.flash("error_msg", "Houve um erro ao enviar a proposta");
                res.redirect("/");
            });



    }

})

router.get('/visualizarCliente',(req,res) =>{
    Personalizacao.findOne({where:{id: req.query.proposta}, 
        include:[{model: Produto}],
        raw : true,
        nest : true
    }).then((personalizacao) => {
        if(personalizacao.status == "Respondido pelo vendedor")
        {
            res.render('propostas/responderProposta', {personalizacao: personalizacao})
        }
        else
        {
            res.render('propostas/verProposta', {personalizacao: personalizacao})
        }
    }) 
})

router.post('/aceitarCliente',configprod.upload, async (req,res) =>
{
    Personalizacao.update({status: "Aceito pelo cliente"},
    {where:{id: req.body.personalizacao}})
    
    var endereco = await Endereco.findOne({where:{UserId: req.user.id}});

    Pedido.findOne({where:{UsuarioId: req.user.id},include:[{model: Status,where:{status:"Processando"}}],raw: true, nested:true
}).then(async (pedido) => {
        console.log(pedido)
        const P = await Personalizacao.findOne(
            {
                where:{id: req.body.personalizacao},
                include:[{model: Produto},{model: Usuario}],
                raw : true,
                nest : true
            })

        if(pedido)
        {      
            Item.update({
                PedidoId: pedido.id,
                preco: P.preco
            },
            {
                where:{PersonalizacaoId: req.body.personalizacao}
            }).then(function(){
                req.flash("success_msg","Item adicionado ao carrinho")
                res.redirect('/');
            })
        }
        else
        {
                Status.create({
                status:"Processando"
            }).then(async (S) => {

            Pedido.create({
                    idVendedor: P.usuarioVendedor,
                    UsuarioId: P.UsuarioId,
                    ProdutoId: P.ProdutoId,
                    StatusId: S.id,
                    EnderecoId: endereco.id,
                    DataHora: sequelize.fn('NOW')
                    }).then((Pedido) =>{
                        console.log(Pedido);
                        Item.update(
                            {
                                PedidoId: Pedido.id,
                                preco: P.preco           
                            },
                            {
                                where:{PersonalizacaoId: req.body.personalizacao}
                            }
                        )
                    })
        }).then(function()
        {
            req.flash("success_msg","Personalizacao enviada com sucesso!")
            res.redirect('/');
        })
            
        }
    })
})


// Propostas Vendedor
router.get('/visualizarVendedor',(req,res) =>{
    Personalizacao.findOne({where:{id: req.query.proposta}, 
        include:[{model: Produto}],
        raw : true,
        nest : true
    }).then((personalizacao) => {
            res.render('propostas/visualizarVendedor', {personalizacao: personalizacao})
    }) 
})

router.get('/recebidas', (req,res) => {
    if(req.query.p)
    {
        Personalizacao.findOne({where:{id: req.query.p}}).then((personalizacao) =>
        {
            Personalizacao.Update(
            {
                status: "Recusada pelo vendedor"
            },
            {
                where:{id: personalizacao.id}
            })
        }).then(
            res.redirect('propostas/recebidas')
        )
    }

    Personalizacao.findAll(
        {
            where:{usuarioVendedor: req.user.id},order:[['createdAt','desc']],
            include:[{model: Produto}],
            raw : true,
            nest : true
        }).then((personalizacoes) => {
             res.render('propostas/propostasRecebidas', {personalizacoes: personalizacoes})
    })
})

router.get('/orcamento',(req,res)=>{
    Personalizacao.findOne({where:{id: req.query.orcamento}, 
        include:[{model: Produto}],
        raw : true,
        nest : true
    }).then((personalizacao) => {
        if(personalizacao.status == "Respondido pelo vendedor")
        {
            res.render('propostas/verProposta', {personalizacao: personalizacao})
        }
        else
        {
            res.render('propostas/orcamento', {personalizacao: personalizacao})
        }
    }) 
})

router.post('/cadOrcamento', configprod.upload, (req, res) => {
    let errors = [];

    if (!req.body.espOrcamento || typeof req.body.espOrcamento == null || typeof req.body.espOrcamento == undefined || typeof req.body.espOrcamento == Number) errors.push({ text: "Especificacoes inválidas" });


    if (errors.length > 0) {

    } else {
        const updateData = {
            especificacoes: req.body.espOrcamento,
            status: "Respondido pelo vendedor",
            preco: req.body.precoOrc
        };

        if (req.files['imagem1']) {
            updateData.imgProposta1 = req.files['imagem1'][0].path;
        }
        if (req.files['imagem2']) {
            updateData.imgProposta2 = req.files['imagem2'][0].path;
        }
        if (req.files['imagem3']) {
            updateData.imgProposta3 = req.files['imagem3'][0].path;
        }

        Personalizacao.update(updateData, {
            where: { id: req.body.personalizacao }
        }
        ).then(function () {
            req.flash("success_msg", "Personalizacao enviada com sucesso!")
            res.redirect('/');
        }).catch(function (erro) {
            req.flash("error_msg", "Houve um erro ao enviar")
            res.redirect("/");
        })
    }
})





module.exports = router;