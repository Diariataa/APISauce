const Sauce = require('../models/sauces');
const express = require('express');
const fs = require('fs')

const router = express.Router();

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })
      .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  }

 
 exports.modifyThing = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
} : { ...req.body };

delete sauceObject._userId;
Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
            Thing.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
};



  exports.likeSauce = async (req, res, next) => {
    try {
    // charge la sauce en fonction de l'id dans la req.params
    const sauce = await Sauce.findOne({ _id: req.params.id });
    // Si usersLiked est false et like = 1, l'utilisateur aime (= like) la sauce
    if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
    const like = await Sauce.updateOne(
    { _id: req.params.id},
    {
    $inc : {likes: 1},
    $push : {usersLiked: req.body.userId}
    }
    )
    }
    // Si usersLiked est true like = 0, l'utilisateur annule son like
    else if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
    const nolike = await Sauce.updateOne(
    { _id: req.params.id},
    {
    $inc : {likes: -1},
    $pull : {usersLiked: req.body.userId}
    }
    )
    }
    // Si usersDisliked est false et like = -1, l'utilisateur n'aime pas (=dislike) la sauce.
    else if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
    const dislike = await Sauce.updateOne(
    { _id: req.params.id},
    {
    $inc : {dislikes: 1},
    $push : {usersLiked: req.body.userId}
    }
    )
    }
    // Si usersDisliked est true et like = 0, l'utilisateur annule son dislike.
    else if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
    const nodislike = await Sauce.updateOne(
    { _id: req.params.id},
    {
    $inc : {dislikes: -1},
    $push : {usersLiked: req.body.userId}
    }
    )
    }
    res.status(200).json({ message: 'Sauce modifié'});
    } catch (error) {
    res.status(400).json({ error});
    }
    }

  module.exports = router