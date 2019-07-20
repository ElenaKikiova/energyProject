function checkAdministrator(path, mongoose, baseUrl, ObjectId, req, res){

    var User = require('../../schemas/userSchema');

    var idCookie = req.cookies.EnergyAdminId;
    if(typeof idCookie != "undefined"){
        mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
            User.findOne({_id: ObjectId(idCookie), Status: "Administrator"}, function(err, user) {
                if(err) throw err;
                if(user != null){
                    res.render(path);
                }
                else {
                    res.redirect("../login?error=NoPermission");
                }
            });
        });
    }
    else res.redirect("../login?error=NoPermission");
}

module.exports = checkAdministrator;
