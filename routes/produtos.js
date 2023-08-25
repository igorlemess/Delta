const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const passport = require("passport");
const configprod = require('../config/produto.js');
const Produto = require('../models/Produto.js');
const path = require('path');
const flash = require("connect-flash");
const Categoria = require('../models/Categoria.js');
const Pedido = require('../models/Pedido.js')
const Status = require('../models/Status.js')
const Item = require('../models/Item.js')
router.use('/Images', express.static(path.join(__dirname, '../Images')))

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/usuario/login');
}

router.get("/criarAnuncio", isAuthenticated, (req, res) => {
    Categoria.findAll().then((categorias) => {
        res.render("produtos/criarAnuncio", {categorias: categorias});
    })
});

router.post('/novoAnuncio',configprod.upload, isAuthenticated, function(req, res){

    let errors = [];

    if (!req.body.titulo || typeof req.body.titulo == null || typeof req.body.titulo == undefined || typeof req.body.titulo == Number) errors.push({ text: "Título inválido" });

    if(errors.length > 0){

    }else{
        const novoProduto = {
            nomeProd: req.body.titulo,
            categoria: req.body.categoria,
            preco: req.body.preco,
            descricao: req.body.descricao,
            qtde: req.body.quantidade,
            UsuarioId: req.user.id
        }

        if (req.files['imagem1']) {
            novoProduto.imagem1 = req.files['imagem1'][0].path;
        }

        if (req.files['imagem2']) {
            novoProduto.imagem2 = req.files['imagem2'][0].path;
        }

        if (req.files['imagem3']) {
            novoProduto.imagem3 = req.files['imagem3'][0].path;
        }
        
        Produto.create(novoProduto).then(function()
        {
            req.flash("success_msg","Anúncio criado com sucesso!")
            res.redirect('/produtos');
        }).catch(function(erro){
            req.flash("error_msg","Houve um erro ao salvar")
            res.redirect("/produtos");
        })
    }
});

router.get('/editarAnuncio', isAuthenticated, function(req,res){
    Produto.findOne({where:{id: req.query.id}}).then(async (produto) => {
        var categoria = await Categoria.findOne({where:{id: produto.categoria}})

        res.render('produtos/editarAnuncio', {produto: produto, categoria: categoria});
    }).catch((err) =>{
        req.flash("error_msg","Houve um erro ao editar")
        res.redirect("/produtos");
    })

});

router.post('/editar', function(req,res){
    Produto.update({nomeProd: req.body.titulo,preco: req.body.preco, descricao: req.body.descricao, qtde: req.body.qtde},{where:{id: req.body.id}}).then(()=>{
            req.flash("success_msg","Anúncio editado com sucesso!")
            res.redirect("/produtos")
        }).catch((error)=>{
             req.flash("error_msg", "Houve um erro ao salvar a edição do anúncio")
        })
})

router.post('/excluirAnuncio', isAuthenticated, function(req,res){
    Produto.destroy({where:{id: req.body.id}}).then(()=>{
            req.flash("success_msg","Anúncio excluído com sucesso")
            res.redirect("/produtos")
        
        }).catch((error)=>{
             req.flash("error_msg", "Houve um erro ao excluir o anúncio")
        })
})




//     Post.create({
//         titulo: req.body.titulo,
//         conteudo: req.body.conteudo
//     }).then(function(){
//         res.redirect('/')
//     }).catch(function(erro){
//         res.send("Houve um erro: " + erro)
//     })
// })



module.exports = router;