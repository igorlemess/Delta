const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const Usuario = require("../models/Usuario");
const Endereco = require("../models/Endereco");
//const Usuariog = require("../models/Usuariog");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require('nodemailer');
const configuser = require('../config/usuario.js');

router.get("/cadastro", (req, res) => {
  res.render("users/cadastro")
});

router.post("/cadastro", configuser.upload, (req, res) => {
  let errors = [];

  if (!req.body.nome) errors.push({ text: "Nome inválido." });

  if (!req.body.telefone) errors.push({ text: "Telefone inválido." });

  if (!req.body.email) errors.push({ text: "Email inválido." });

  if (!req.body.senha) errors.push({ text: "Senha inválida." });

  if (req.body.email != req.body.cemail)
    errors.push({ text: "Emails não são iguais." });

  if (req.body.senha != req.body.csenha)
    errors.push({ text: "Senhas não são iguais." });

  if (req.body.flexSwitchCheckDefault == "juridica") {
    if (!req.body.cpf) errors.push({ text: "CPF inválido." });

    if (!req.body.rg) errors.push({ text: "RG inválido." });

    if (!req.body.datanasc) errors.push({ text: "Data de nascimento inválida." });
  }

  /* if (req.body.flexSwitchCheckDefault != "juridica") {
      if (!req.body.cnpj) errors.push({ text: "CNPJ inválido." });

      if (!req.body.razaosocial) errors.push({ text: "Razão Social inválida." });

      if (!req.body.inscricaoe) errors.push({ text: "Inscrição Estadual inválida." });
  } */

  /*     if (!req.body.instituicao) errors.push({ text: "Instituição inválida." });
  
      if (!req.body.agencia) errors.push({ text: "Agência inválida." });
  
      if (!req.body.conta) errors.push({ text: "Conta inválida." });
  
      if (!req.body.instagram) errors.push({ text: "Instagram inválido." });
  
      if (!req.body.facebook) errors.push({ text: "Facebook inválido." });
  
      if (!req.body.site) errors.push({ text: "Site inválido." }); */

  if (errors.length > 0) {
    res.render("users/cadastro", {
      errors: errors,
      nome: req.body.nome,
      cpf: req.body.cpf,
      datanasc: req.body.datanasc,
      telefone: req.body.telefone,
      email: req.body.email,
      rg: req.body.rg,
      inscricaoe: req.body.inscricaoe,
      cnpj: req.body.cnpj,
      razaosocial: req.body.razaosocial,
      instituicao: req.body.instituicao,
      agencia: req.body.agencia,
      conta: req.body.conta,
      instagram: req.body.instagram,
      facebook: req.body.facebook,
      site: req.body.site
    });
  } else {
    Usuario.findOne({ where: { Email: req.body.email } })
      .then((usuario) => {
        if (usuario) {
          req.flash("error_msg", "Email já registrado.");
          res.redirect("/usuario/cadastro");
        } else {
          const newUser = Usuario.build({
            Nome: req.body.nome,
            CPF: req.body.cpf,
            dataNascimento: req.body.datanasc,
            Telefone: req.body.telefone,
            Email: req.body.email,
            Senha: req.body.senha,
            RG: req.body.rg,
            inscricaoEstadual: req.body.inscricaoe,
            CNPJ: req.body.cnpj,
            razaoSocial: req.body.razaosocial,
            instituicao: req.body.instituicao,
            agencia: req.body.agencia,
            conta: req.body.conta,
            instagram: req.body.instagram,
            facebook: req.body.facebook,
            site: req.body.site
          });
          
          if (req.file) {
            newUser.imgPerfil = req.file.filename; // Obtém o nome do arquivo da imagem se existir
          }

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.Senha, salt, (err, hash) => {
              if (err) {
                req.flash("error_msg", "Erro no cadastro.");
                res.redirect("/usuario/cadastro");
              }
              newUser.Senha = hash;
              newUser
                .save()
                .then(() => {
                  req.flash(
                    "success_msg",
                    "Você foi cadastrado(a)."
                  );
                  res.redirect("/usuario/login");
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          });
        }
      })
      .catch((err) => {
        req.flash("error_msg", "Algo deu errado.");
        res.redirect("/usuario/cadastro");
      });
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", (req, res, next) => {
  const { email, senha } = req.body;

  passport.authenticate("local", (err, usuario, info) => {
    if (err) {
      return next(err);
    }

    if (!usuario) {
      req.flash("error_msg", info.message);
      return res.redirect("/usuario/login");
    }

    req.logIn(usuario, (err) => {
      if (err) {
        return next(err);
      }

      // Salvando o ID do usuário logado em uma variável de sessão
      req.session.userId = usuario.id;

      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      // Trate o erro aqui, se necessário
      console.error(err);
    }
    req.flash("success_msg", "Você saiu.");
    res.redirect("/usuario/login");
  });
});

/* // Rota de autenticação com o Google
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] })
);

// Rota de callback do Google após a autenticação
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/usuario/cadastro' }),
    (req, res) => {
        // Redirecionar para a página de sucesso após a autenticação
        res.redirect('/usuario/login');
    }
);

// Rota de sucesso após a autenticação
router.get('/usuario/login', (req, res) => {
    res.send('Autenticação bem-sucedida!');
}); */

router.get("/recsenha", (req, res) => {
  res.render("users/recsenha");
});

router.post('/recSenha', async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ikarosdeltatg@gmail.com', // Insira seu email
      pass: 'gnlqactnsdyzpwcw', // Insira sua senha do email
    },
  });

  try {
    // Procura o usuário no banco de dados pelo email
    const usuario = await Usuario.findOne({ where: { Email: req.body.semail } });
    const email = req.body.semail;

    if (usuario) {
      // Gera uma nova senha
      const novaSenha = Math.random().toString(36).slice(-8); // Gera uma senha aleatória de 8 caracteres

      // Encripta a nova senha
      const senhaEncriptada = await bcrypt.hash(novaSenha, 10);

      // Atualiza a senha do usuário no banco de dados
      await Usuario.update({ Senha: senhaEncriptada }, { where: { Email: email } });

      // Corpo do email
      const corpoEmail = `
            <h1>Recuperação de Senha</h1>
            <p>Olá,</p>
            <p>Recebemos uma solicitação para recuperar sua senha.</p>
            <p>Sua nova senha é: <strong>${novaSenha}</strong></p>
            <p>Recomendamos que você faça login com essa nova senha e a altere imediatamente.</p>
            <p>Para alterar sua senha, clique no link abaixo:</p>
            <a href="http://localhost:8081/usuario/alterarsenha">Alterar Senha</a>
            <p>Se você não solicitou a recuperação de senha, por favor, entre em contato conosco.</p>
            <p>Atenciosamente,</p>
            <p>A equipe de suporte Delta 💜</p>
            `;

      // Envia o email com a nova senha
      enviarEmail(email, 'Recuperação de Senha', corpoEmail);

      req.flash("success_msg", "Um email com a nova senha foi enviado para você.");
      res.redirect("/usuario/recsenha");
    } else {
      req.flash("error_msg", "Email não encontrado.");
      res.redirect("/usuario/recsenha");
    }
  } catch (error) {
    console.error('Erro ao recuperar senha:', error);
    req.flash("error_msg", 'Algo deu errado.');
    res.redirect("/usuario/recsenha");
  }

  // Função para enviar o email
  async function enviarEmail(destinatario, assunto, corpo) {
    try {
      // Configurações do email
      const mailOptions = {
        from: 'ikarosdeltatg@gmail.com', // Insira seu email
        to: destinatario,
        subject: assunto,
        html: corpo
      };

      // Envia o email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email enviado:', info.messageId);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  }
});

router.get("/alterarsenha", (req, res) => {
  res.render("users/alterarsenha");
});

router.post("/alterarsenha", (req, res, next) => {
  const { AntigaSenha, Senha, csenha } = req.body;
  const userId = req.session.userId;

  // Verificar se a senha antiga digitada é a senha atual do usuário logado
  Usuario.findByPk(userId)
    .then((usuario) => {
      if (!usuario) {
        req.flash("error_msg", "Faça login para continuar");
        return res.redirect("/usuario/login");
      }

      bcrypt.compare(AntigaSenha, usuario.Senha, (err, isMatch) => {
        if (err) {
          return next(err);
        }

        if (!isMatch) {
          req.flash("error_msg", "A senha antiga está incorreta");
          return res.redirect("/usuario/alterarsenha");
        }

        // Verificar se as duas novas senhas são iguais
        if (Senha !== csenha) {
          req.flash("error_msg", "As novas senhas não coincidem");
          return res.redirect("/usuario/alterarsenha");
        }

        // Criptografar a nova senha
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            return next(err);
          }

          bcrypt.hash(Senha, salt, (err, hash) => {
            if (err) {
              return next(err);
            }

            // Atualizar a senha no banco de dados
            usuario.Senha = hash;
            Usuario.update(
              { Senha: hash },
              { where: { id: userId } }
            )
              .then(() => {
                req.flash("success_msg", "Senha alterada com sucesso");
                return res.redirect("/usuario/login");
              })
              .catch((err) => {
                return next(err);
              });
          });
        });
      });
    })
    .catch((err) => {
      return next(err);
    });
});

router.get("/alterarperfil", (req, res, next) => {
  const userId = req.session.userId;

  Usuario.findByPk(userId)
    .then((usuario) => {
      if (!usuario) {
        req.flash("error_msg", "Faça login para continuar");
        return res.redirect("/usuario/login");
      }
      res.render("users/alterarperfil", { usuario });
    })
    .catch((err) => {
      return next(err);
    });
});

router.post("/alterarperfil", configuser.upload, (req, res, next) => {
  const { email, nome, telefone, instagram, facebook, site } = req.body;
  const userId = req.session.userId;

  Usuario.findByPk(userId)
    .then((usuario) => {
      if (!usuario) {
        req.flash("error_msg", "Faça login para continuar");
        return res.redirect("/usuario/login");
      }

      if (email) {
        usuario.Email = email;
      }
      if (nome) {
        usuario.Nome = nome;
      }
      if (telefone) {
        usuario.Telefone = telefone;
      }
      if (instagram) {
        usuario.instagram = instagram;
      }
      if (facebook) {
        usuario.facebook = facebook;
      }
      if (site) {
        usuario.site = site;
      }

      if (req.file) {
        usuario.imgPerfil = req.file.filename; // Atualiza a imagem de perfil se o upload foi feito
      }

      Usuario.update(
        {
          Email: usuario.Email,
          imgPerfil: usuario.imgPerfil,
          Nome: usuario.Nome,
          Telefone: usuario.Telefone,
          instagram: usuario.instagram,
          facebook: usuario.facebook,
          site: usuario.site
        },
        {
          where: { id: userId }
        }
      )
        .then(() => {
          req.flash("success_msg", "Perfil atualizado com sucesso");
          return res.redirect("/usuario/alterarperfil");
        })
        .catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      return next(err);
    });
});


router.post("/excluirconta", (req, res, next) => {
  const userId = req.session.userId;

  // Verificar se o usuário está logado
  Usuario.findByPk(userId)
    .then((usuario) => {
      if (!usuario) {
        req.flash("error_msg", "Faça login para continuar");
        return res.redirect("/usuario/login");
      }

      Usuario.destroy({
        where: { id: userId },
      })
        .then(() => {
          req.flash("success_msg", "Conta excluída com sucesso");
          return res.redirect("/usuario/login");
        })
        .catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      return next(err);
    });
});

router.get("/alterarendereco", async (req, res) => {
  const userId = req.session.userId; // Obtendo o ID do usuário logado a partir da sessão

  try {
    // Verificar se o usuário está logado
    if (!userId) {
      req.flash('error_msg', 'Faça login para continuar');
      return res.redirect('/usuario/login');
    }

    // Verificar se o usuário já possui um endereço cadastrado
    const endereco = await Endereco.findOne({ where: { UserID: userId } });

    res.render("users/alterarendereco", { enderecoExistente: endereco });
  } catch (error) {
    console.log(error);
    req.flash('error_msg', 'Ocorreu um erro ao carregar a página');
    return res.redirect('/');
  }
});


router.post('/alterarendereco', async (req, res) => {
  const userId = req.session.userId; // Obtendo o ID do usuário logado a partir da sessão

  // Verificar se o usuário está logado
  if (!userId) {
    req.flash('error_msg', 'Faça login para continuar');
    return res.redirect('/usuario/login');
  }

  // Obtendo os dados do formulário
  const { cep, endereco, numero, cidade, UF, bairro, complemento } = req.body;

  try {
    // Verificar se o usuário já possui um endereço cadastrado
    const enderecoExistente = await Endereco.findOne({ where: { UserID: userId } });

    if (enderecoExistente) {
      // Atualizar o endereço existente
      await Endereco.update(
        {
          cep: cep,
          endereco: endereco,
          numero: numero,
          cidade: cidade,
          UF: UF,
          bairro: bairro,
          complemento: complemento
        },
        { where: { UserID: userId } }
      );

      req.flash('success_msg', 'Endereço atualizado com sucesso');
      return res.redirect('/usuario/alterarendereco');
    } else {
      // Criar um novo endereço
      await Endereco.create({
        UserID: userId,
        cep: cep,
        endereco: endereco,
        numero: numero,
        cidade: cidade,
        UF: UF,
        bairro: bairro,
        complemento: complemento
      });

      req.flash('success_msg', 'Endereço cadastrado com sucesso');
      return res.redirect('/usuario/alterarendereco');
    }

    // Redirecionar para uma rota específica, por exemplo, a página principal
    return res.redirect('/');
  } catch (error) {
    console.log(error);
    req.flash('error_msg', 'Erro ao cadastrar/atualizar endereço');
    return res.redirect('/usuario/alterarendereco');
  }
});

module.exports = router;