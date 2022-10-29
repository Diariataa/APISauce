const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];//diviser les chaine de caractere autour de l'espace pour avoir un tableau
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //pour decoder avec la cle secrete
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};