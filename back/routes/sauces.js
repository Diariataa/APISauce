const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


const sauceCtrl = require('../controllers/sauces');

//auth ajouter apres le middlewqre pour la gestion des images
router.post('/', auth,multer, sauceCtrl.createSauce );
// modifier une sauce existante
 
router.put('/:id',auth, multer, sauceCtrl.modifySauce);
//supprimer un objet existant 
router.delete('/:id', auth, sauceCtrl.deleteSauce );
router.get('/:id',auth, sauceCtrl.getOneSauce );

 // recupere la liste des sauces
router.get('/', auth, sauceCtrl.getAllSauces);
// router.get('/:id/like',auth, sauceCtrl.likeOne );



module.exports = router;