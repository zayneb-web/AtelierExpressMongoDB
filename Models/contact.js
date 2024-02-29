// Importation mongoose 
const mongoose = require('mongoose');
/* Schema c'est une classe définir la structure des 
documents stockés dans une collection de base de données MongoDB */

var Contact= new mongoose.Schema(
 {
    FullName :{type: String, required: true},
    Phone : {type:Number,required: true,min:8}
 }
); 
/*export modele de contact créé à partir de schema dans mongo
 collection= contacts  ici  table nommé Contact*/
module.exports = mongoose.model('contacts',Contact); 