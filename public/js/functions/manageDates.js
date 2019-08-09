function composeDate(DateString){
    if(typeof DateString != "string") DateString = String(DateString);

    var day = new Date(DateString).getDate();
    if(day < 10) day = "0" + day;

    var month = new Date(DateString).getMonth() + 1;
    if(month < 10) month = "0" + month;

    var year = new Date(DateString).getFullYear();

    var composedDate = day + "." + month + "." + year;
    return composedDate;
}
