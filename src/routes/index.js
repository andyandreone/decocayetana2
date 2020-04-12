const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const User = require('../models/User');
const passport = require('passport');
const {isAuthenticated} = require('../helpers/auth');

//Carga los productos en el home
router.get('/', async(req, res)=>{
  const producto = await Producto.find().sort({date:'desc'});
  res.render('productos',{producto});
});

//Configuracion para ingresar como administrador
router.get('/admin', (req, res)=>{
  res.render('admin');
});

router.get('/edicion',  isAuthenticated, async(req, res)=>{
  const producto = await Producto.find().sort({date:'desc'});
  res.render('edicion',{producto});
});

//Primo1234 anaromeo@decocayetana.com
router.post('/admin', passport.authenticate('local',{
  successRedirect: '/edicion',
  failureRedirect: '/admin',
  failureFlash: true
}));

router.get('/admin/logout',(req, res)=>{
  req.logout();
  res.redirect('/');
});

//Configuraciones para agregar, editar o eliminar productos
router.get('/admin/update', isAuthenticated,(req, res)=>{
  res.render('update');
});

router.post('/admin/new-product', isAuthenticated,async(req, res)=>{
const {card_link, card_text, card_title} =req.body;
const errors =[];

if(!card_title){
  errors.push({text: 'El titulo no puede quedar vacio'});
}
if(!card_link){
  errors.push({text: 'El link no puede quedar vacio'});
}
if(errors.length > 0){
    res.render('update',{
      errors,
      card_link,
      card_text,
      card_title
    });
  }else{
    const newProduct = new Producto({card_link, card_text, card_title});
    await newProduct.save();
    req.flash('success_msg', 'Producto Agregado Satistactoriamente');
    res.redirect('/edicion');
  }
})

router.get('/admin/edit-product/:id', isAuthenticated,async(req, res)=>{
  const producto = await Producto.findById(req.params.id);
  res.render('editar', {producto});
});

router.put('/admin/edit-product/:id',isAuthenticated, async(req, res)=>{
  const{card_link, card_text, card_title} =req.body;
  await Producto.findByIdAndUpdate(req.params.id,{card_link, card_text, card_title});
  req.flash('success_msg', 'Producto Editado Correctamente');
  res.redirect('/edicion');
});

router.delete('/admin/delete/:id',isAuthenticated, async(req, res)=> {
await Producto.findByIdAndDelete(req.params.id);
req.flash('success_msg', 'Producto Eliminado Satistactoriamente');
res.redirect('/edicion');
});










router.get('/users/signup', (req, res) =>{
res.render('signup');
});

router.post('/users/signup', async(req, res)=>{
  const {email, password, confirm_password} = req.body;
  const errors = [];
  if(password != confirm_password){
    errors.push({text: 'Las contraseñas no coinciden'});
  }
  if(errors.length>0){
    res.render('users/signup', {errors, email,password, confirm_password});
  }
  else{
    const emailUser = await User.findOne({email: email});
    if(emailUser){
      //error aca
    req.flash('error_msg', 'El email ya exsite');
    res.redirect('/users/signup');
    }
    const newUser = new User ({email, password});
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    req.flash('success_msg', 'Usuario Agregado Satistactoriamente');
    res.redirect('/admin');

  }
});





/*
router.get('/notes/add', isAuthenticated, (req, res)=>{
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async(req, res) =>{
  const {title, description}= req.body;
  const errors = [];

  if(!title){
    errors.push({text: 'Please write a tittle'});
  }
  if(!description){
    errors.push({text: 'Please write a description'});
  }
  if(errors.length > 0){
    res.render('notes/new-note',{
      errors,
      title,
      description
    });
  }else{
    const newNote = new Note({title, description});
    newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Nota Agregada Satistactoriamente');
    res.redirect('/notes');
  }
});

router.get('/notes',isAuthenticated, async(req, res)=>{
  const notes = await Note.find({user: req.user.id}).sort({date:'desc'});
  res.render('notes/all-notes',{notes});
});

router.get('/notes/edit/:id',isAuthenticated, async(req, res)=>{
  const note = await Note.findById(req.params.id);
  res.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id',isAuthenticated, async(req, res)=>{
  const{title, description}= req.body;
  await Note.findByIdAndUpdate(req.params.id, {title, description});
  req.flash('success_msg', 'Nota Editada Satistactoriamente');
  res.redirect('/notes');
})

router.delete('/notes/delete/:id',isAuthenticated, async(req, res)=> {
await Note.findByIdAndDelete(req.params.id);
req.flash('success_msg', 'Nota Eliminada Satistactoriamente');
res.redirect('/notes');
});
*/
module.exports = router;
