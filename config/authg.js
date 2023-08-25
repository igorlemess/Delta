const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Sequelize = require('sequelize');
const  GUser  = require("../models/Usuariog"); // Assume que o modelo GUser já foi definido corretamente
var passport = require('passport');

module.exports = (passport) => {
  passport.use("google", new GoogleStrategy({
    clientID: '1079931794664-3ohne9brfkh1cr1fm0sd6acj51ctmsjj.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: '/usuario/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await GUser.findOne({ where: { googleId: profile.id } });

      if (existingUser) {
        // O usuário já está registrado, retorne o objeto do usuário existente
        return done(null, existingUser);
      }

      // O usuário não está registrado, crie um novo usuário com os dados do perfil
      const newUser = await GUser.create({
        googleId: profile.id,
        displayName: profile.displayName
        // Atribua outros campos do perfil do usuário, se necessário
      });

      // Retorne o objeto do usuário recém-criado
      return done(null, newUser);
    } catch (err) {
      return done(err);
    }
  }));
};