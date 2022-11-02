const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Schema = require("../models/Password");

// connecter pour la premiere fois
exports.signup = (req, res, next) => {
  if (!Schema.validate(req.body.password)) {
    //Renvoie une erreur si le schema de mot de passe n'est pas respecté
    return res.status(401).json({
      message:
        "Le mot de passe doit contenir au moins 8 caractères, un chiffre, une majuscule, une minuscule et ne pas contenir d'espace !",
    });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Voir si l'email existe et si le code est bon donc pon utilise findone
//faut gerer une promesse reussir et une erreur
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.SECRET_TOKEN,
              { expiresIn: "24h" }
              //  Les tokens d'authentification permettent aux utilisateurs de se connecter une seule fois à leur compte. Au moment de se connecter,
              //   ils recevront leur token et le renverront
              //   automatiquement à chaque requête par la suite. Ceci permettra au back-end de vérifier que la requête est authentifiée.
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
