//implémenter des téléchargements de fichiers pour que les 
// utilisateurs puissent télécharger des sauces.
const multer = require('multer');

// nous utiliserons multer , un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP. 
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    let lastDotIndex = file.originalname.lastIndexOf(".");
    let name = file.originalname.slice(0, lastDotIndex)
    let extension = file.originalname.slice(lastDotIndex)
    let newName = `${name}-${dateformat(new Date(), 'isoDateTime')}${extension}`
    callback(null, newName)
  }
});

module.exports = multer({storage: storage}).single('image');