function getUserCookie(cookieType, req){
    var returnValue;
    if(cookieType == "username") returnValue = req.cookies.EnergyUsername;
    else returnValue = req.cookies.EnergyUserId;
    return returnValue;
}

module.exports = getUserCookie;
