const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const passport = require("passport");
const configprod = require('../config/produto.js');
const Produto = require('../models/Produto.js');
const path = require('path');

router.get("/criarAnuncio", (req, res) => {
    res.render("posts/criarAnuncio")
});

router.post('/novoAnuncio',configprod.upload, function(req, res){

    let errors = [];

    if (!req.body.titulo || typeof req.body.titulo == null || typeof req.body.titulo == undefined || typeof req.body.titulo == Number) errors.push({ text: "Título inválido" });

        Produto.create({
        nomeProd: req.body.titulo,
        categoria: req.body.categoria,
        preco: req.body.preco,
        descricao: req.body.descricao,
        imagem1: req.files['imagem1'][0].path,
        imagem2: req.files['imagem2'][0].path,
        imagem3: req.files['imagem3'][0].path
        }).then(function()
        {
            res.redirect('/')
        }).catch(function(erro){
            res.send("Houve um erro: " + erro);
        })
});

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