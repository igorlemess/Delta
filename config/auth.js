const localStrategy = require("passport-local").Strategy;
const sequelize = require("sequelize");
const bcrypt = require("bcrypt");
Usuario = require("../models/Usuario");

module.exports = (passport) => {
    passport.use(
        new localStrategy(
            {
                usernameField: "Email",
                passwordField: "Senha",
            },
            (Email, Senha, done) => {
                Usuario.findOne({where: {Email: Email}}).then((Usuario) => {
                    if (!Usuario)
                        return done(null, false, {
                            message: "Esse email não está cadastrado",
                        });

                    bcrypt.compare(Senha, Usuario.Senha, (err, isMatch) => {
                        if (isMatch) {
                            return done(null, Usuario);
                        } else {
                            return done(null, false, {
                                message: "Senha incorreta",
                            });
                        }
                    });
                });
            },
        ),
    );

    passport.serializeUser((Usuario, done) => {
        done(null, Usuario.id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findByPk(id)
          .then(usuario => {
            done(null, usuario);
          })
          .catch(err => {
            done(err, null);
          });
      });
};
