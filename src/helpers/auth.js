const helpers ={};

helpers.isAuthenticated = (req, res, next) =>{
if(req.isAuthenticated()){
  return next();
}
req.flash('erro_msg', 'No autorizado');
res.redirect('/admin');
};

module.exports = helpers;
