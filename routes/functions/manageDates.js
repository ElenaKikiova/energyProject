function getDay(DateString){
    if(typeof DateString != "string") DateString = String(DateString);
    var day = new Date(DateString).getDate();
    if(day < 10) day = "0" + day;
    return day;
}

function getMonth(DateString){
    var month = new Date(DateString).getMonth() + 1;
    if(month < 10) month = "0" + month;
    return month;
}

function composeDate(DateString){
    if(typeof DateString != "string") DateString = String(DateString);
    var day = getDay(DateString);
    var month = getMonth(DateString);
    var year = new Date(DateString).getFullYear();

    var composedDate = day + "." + month + "." + year;
    return composedDate;
}

module.exports = {composeDate, getDay, getMonth};
