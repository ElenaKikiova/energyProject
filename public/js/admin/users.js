
// Load ingredients

function parseDate(d) {

    var result;
    var date = new Date(d);
    if(date != "Invalid Date"){
        var day = date.getDate();
        if(day < 9) day = "0" + day;
        var month = date.getMonth() + 1;
        if(month < 9) month = "0" + month;
        result = day + "." + month + "." + date.getFullYear();
    }
    else result = "-";

    return result;
}

function statusBadge(status){
    var result;
    if(status == "Administrator") result = "A";
    else result = "U";

    return result;
}

function loadUsers(){

    elementLoading($("body"), "show");

    var Table = $("#UsersTable");

    $.get({ url: "/admin/loadAllUsers" })
    .done(function(data){

        var Users = data;

        if(Users != null){

            for(var i = 0; i < Object.keys(Users).length; i++){
                var User = Object.values(Users)[i];
                User.id = Object.keys(Users)[i];
                Table.append("<tr data-user-id='" + User.id + "'>" +
                    "<td>" + User.Username + "</td>" +
                    "<td>" + User.Email + "</td>" +
                    "<td>" + statusBadge(User.Status) + "</td>" +
                    "<td>" + parseDate(User.RegisterDate) + "</td>" +
                    "<td>" + parseDate(User.LastEntry) + "</td>" +
                    "<td>" + User.Records + "</td>" +
                "</tr>");
            }

            $("#UserCount").html(Object.keys(Users).length);


            var dataTableOptions = {
                "paging": false,
                "language":{
                    "searchPlaceholder": "Search records"
                },
                "oLanguage": {

                    "sEmptyTable": "Няма резултати",
                    "sSearch": "Търсене: ",
                    "sZeroRecords": "Няма резултати за това търсене",
                    "sInfo": "Намерени са _TOTAL_ потребителя",
                    "sInfoEmpty": "Намерени са 0 потребителя",
                    "sInfoFiltered": " от _MAX_",
                    "oPaginate": {
                      "sFirst": "Първа",
                      "sLast": "Последна",
                      "sPrevious": "❰",
                      "sNext": "❱"
                    }
                }
            };

            var dataTable = Table.DataTable(dataTableOptions);
            dataTable.order( [ 1, 'asc' ] ).draw();


            elementLoading($("body"), "hide");
        }
    });
};

loadUsers();
