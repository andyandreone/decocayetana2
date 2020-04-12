const mongoose = require('mongoose');
const {Schema} = mongoose;

const EsquemaProducto = new Schema ({
  card_title:{type: String, required: true},
  card_text:{type:String, required: false},
  card_link:{type:String, required: true},
  date:{type: Date, default: Date.now},
});



module.exports = mongoose.model('Producto', EsquemaProducto)
