const express = require("express");
const res = require("express/lib/response");
const path = require('path');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const Produto = require('./models/Produto.js');
const Usuario = require('./models/Usuario.js');
const Item = require('./models/Item.js')
const Personalizacao = require('./models/Personalizacao.js')
const Pedido = require('./models/Pedido.js')
const Status = require('./models/Status.js')
const usuario = require("./routes/usuarios");
const session = require("express-session");
const passport = require("passport");
const admin = require("./routes/admin")
const Sequelize = require('sequelize');
const produtos = require('./routes/produtos.js');
const Handlebars = require("handlebars")
const Categoria = require('./models/Categoria.js');
const propostas = require("./routes/propostas");
const carrinho = require("./routes/carrinho");
const pedidos = require("./routes/pedidos.js")
require("./config/auth")(passport);
const flash = require("connect-flash");
const multer = require('multer');
const { appendFileSync } = require("fs");
const moment = require("moment");
// const db = require("./config/db");
const sequelize = new Sequelize("sqlite::memory:");

// sequelize.sync();

//Session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    res.locals.session = req.session;
    next();
});

// Config
// Template Engine
app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');
app.set("views", "views");
var hbs = handlebars.create({});
// mongoose
//     .connect(db.mongURI)
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) => console.log("Error connecting" + err));
//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/public')));
// Rotas

app.use('/admin', admin)

app.use('/produtos', produtos);

app.use("/usuario", usuario);

app.use("/propostas", propostas);

app.use("/pedidos", pedidos)

app.use("/carrinho", carrinho);

app.use('/Images', express.static(path.join(__dirname, './Images')))



// function simplify(text){
//     const separators = /[s,\.\;:()'+]/g;
//     const diacritics = /[u0300-u036f]/g;
//     //capitalização e normalização
//     text = text.toUpperCase().normalize("NFD").replace(diacritics, "");
//     //separando e removendo repetidos
//     const arr = text.split(separators).filter((item, pos, self) => self.indexOf(item) == pos);
//     console.log(arr);
//     //removendo nulls, undefineds e strings vazias
//     return arr.filter(item => (item));
// }

// Helpers Handlebars

Handlebars.registerHelper('grouped_each', function (every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
});

Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": Math.round((lvalue / rvalue) * 100) / 100,
        "%": lvalue % rvalue
    }[operator];
});

Handlebars.registerHelper('distanceFixed', function (distance) {
    return distance.toFixed(2);
});

Handlebars.registerHelper('isRespondido', function (proposta) {
    if(proposta == "Respondido pelo vendedor")
    {
        return 1;
    }
    else
    {
        return null;
    }
});

Handlebars.registerHelper('isAceitoCliente', function (proposta) {
    if(proposta == "Aceito pelo cliente" || proposta == "Respondido pelo vendedor" )
    {
        return 1;
    }
    else
    {
        return null;
    }
});

Handlebars.registerHelper('pertencePedido',function(IdItem,IdPedido) {
    if(IdItem == IdPedido)
    {
        return 1;
    }
    else
    {
        return null;
    }
});

Handlebars.registerHelper('isProcessando', function (status) {
    if(status == "Processando")
    {
        return 1;
    }
    else
    {
        return null;
    }
});

Handlebars.registerHelper('isEnviado', function (status) {
    if(status == "Enviado")
    {
        return 1;
    }
    else
    {
        return null;
    }
});

Handlebars.registerHelper('formatarReais', function(value) {
    // Verifica se o valor é numérico
    if (typeof value !== 'number') {
      return value;
    }
    
    // Formata o valor em reais
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    
    return formatter.format(value);
  });

Handlebars.registerHelper('formatDate', function(date, format) {
    return moment(date).format(format);
});
//

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/usuario/login');
}

app.get('/pesquisar', function (req, res) {

    let lookupValue = req.query.pesquisar.toLowerCase();

    Produto.findAll({
        where: { nomeProd: sequelize.where(sequelize.fn('LOWER', sequelize.col('nomeProd')), 'LIKE', '%' + lookupValue + '%') }
    }).then((produtos) => {
        if (produtos) {
            res.render("produtos/filtro", { produtos: produtos, qtdep: produtos.length, pesquisa: req.query.pesquisar });
        } else {
            //req.flash("error_msg", "Esta postagem não existe")
        }
    })

})

app.get("/usuario", (req, res) => {
    if (req.query.id) {
      Usuario.findOne({ where: { id: req.query.id } }).then((Usuario) => {
        if (Usuario) {
          Produto.findAll({ where: { UsuarioId: req.query.id } }).then((produtos) => {
            // adicionando as informações loggedin e usuario
            let isLogged = req.session.userId ? true : false;
            let usuarioLogado = req.session.userId ? req.user : null;
            res.render("users/perfil", { usuario: Usuario, produtos: produtos, isLogged: isLogged, usuarioLogado: usuarioLogado });
          });
        }
      });
    } else {
      Usuario.findOne({ where: { id: req.user.id } }).then((Usuario) => {
        if (Usuario) {
          Produto.findAll({ where: { UsuarioId: req.user.id } }).then((produtos) => {
            // adicionando as informações loggedin e usuario
            let isLogged = req.session.userId ? true : false;
            let usuarioLogado = req.session.userId ? req.user : null;
            res.render("users/perfil", { usuario: Usuario, produtos: produtos, isLogged: isLogged, usuarioLogado: usuarioLogado });
          });
        }
      });
    }
  });
  
  

app.get("/propostas", isAuthenticated, (req, res) => {
    if(req.query.p)
    {
        Personalizacao.findOne({where:{id: req.query.p}}).then((personalizacao) =>
        {
            Personalizacao.Update(
            {
                status: "Recusada pelo cliente"
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
            where: { UsuarioId: req.user.id },order:[['createdAt','desc']],
            include: [{ model: Produto }],
            raw: true,
            nest: true
        }).then((personalizacoes) => {
            res.render('propostas/propostasEnviadas', { personalizacoes: personalizacoes })
        })
})


// Personalizacao.findAll({where:{UsuarioId: req.user.id}}).then((personalizacoes) => 
// {
//     // let linhas = sequelize.query('select count(id) from personalizacaos');

//     // for(var i = 1 ; i <= linhas; i++)
//     // {
//     //   var produtos = sequelize.query('select nomeProd from produtos where produtos.id = (select ProdutoId from personalizacaos where id = ' + i + ')')
//     // }
//     Produto.findAll({where:{id: personalizacoes.id}})
//     res.render('propostas/propostasEnviadas', {personalizacoes: personalizacoes, produtos: produtos})
// })

app.get('/categorias', function (req, res) {
    Categoria.findOne({ where: { categoria: req.query.categoria } }).then((categoria) => {
        if (categoria) {
            Produto.findAll({ where: { categoria: categoria.id } }).then((produtos) => {
                res.render("produtos/filtro", { produtos: produtos, qtde: produtos.length, categoria: categoria })
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao tentar listar os posts!")
                res.redirect("/");
            })
        } else {
            req.flash("error_msg", "Esta categoria não existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno ao carregar a página desta categoria")
        res.redirect("/")
    })
})

app.get('/', function (req, res) {
    let isLogged = req.session.userId ? true : false;

    Produto.findAll({ order: [['createdAt', 'desc']], limit: 9 }).then((produtos) => {
        if (isLogged) {
            Usuario.findByPk(req.session.userId)
                .then((usuario) => {
                    res.render("inicial", { isLogged: isLogged, produtos: produtos, usuario: usuario });
                })
                .catch((err) => {
                    console.log(err);
                    res.render("inicial", { isLogged: isLogged, produtos: produtos });
                });
        } else {
            res.render("inicial", { isLogged: isLogged, produtos: produtos });
        }
    })
})

app.get('/produtos', isAuthenticated, function (req, res) {
    Produto.findAll({where:{UsuarioId: req.user.id}, order:[['createdAt', 'desc']]}).then((produtos) => {
      let isLogged = req.session.userId ? true : false;
    
      if (isLogged) {
        Usuario.findByPk(req.session.userId)
          .then((usuario) => {
            res.render("produtos/produtos", { produtos: produtos, isLogged: isLogged, usuario: usuario });
          })
          .catch((err) => {
            console.log(err);
            res.render("produtos/produtos", { produtos: produtos, isLogged: isLogged });
          });
      } else {
        res.render("produtos/produtos", { produtos: produtos, isLogged: isLogged });
      }
    });
  })

app.get('/:id', function (req, res) {
    Produto.findOne({where:{id: req.params.id}}).then((produto) => 
             {
                 if(produto){
                    Usuario.findOne({where:{id: produto.UsuarioId}}).then((usuario) =>{
                     res.render("produtos/produto", {produto: produto, usuario: usuario})}
                     )
                 }else{
                     req.flash("error_msg", "Esta postagem não existe")
                 }
             })
})





// app.post('/cadusuario',function(req,res){
//     Usuario.create({
//         Nome: req.body.nome,
//         CPF: req.body.cpf,
//         dataNascimento: req.body.datanasc,
//         Telefone: req.body.telefone,
//         Email: req.body.email,
//         Senha: req.body.senha
//     }).then(function(){
//         res.redirect('/')
//     }).catch(function(erro){
//         res.send("Houve um erro: " + erro);
//     })
// })



/* app.get("/",function(req,res){
    res.sendFile(__dirname + "/html/index.html");
});

app.get("/sobre", function(req, res){
    res.send("Minha pagina sobre");
});

app.get("/blog", function(req, res){
    res.send("Meu blog");
});

app.get("/ola/:nome/:cargo/:cor", function(req, res){
    res.send(`<h1>Ola ${req.params.nome}</h1>`+`<h2>Seu cargo e: ${req.params.cargo}</h2>`+`<h2>Sua cor e: ${req.params.cor}</h2>`);

});
*/



app.listen(8081, function () {
    console.log("Servidor Rodando");
});

