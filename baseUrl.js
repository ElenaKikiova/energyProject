// Url of the database

// Depends on const online
const online = false;
// const online = true;

var baseUrl = "mongodb://localhost:27017/energy";
if(online == true){
    baseUrl = "mongodb://Admin:energy2019@ds149744.mlab.com:49744/energy";
}

module.exports = baseUrl;
