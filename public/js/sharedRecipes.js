var dataTableOptions = {
    "paging": false,
    "columnDefs": [
        { "orderable": false, "targets": 3 }
    ],
    "oLanguage": {

        "sEmptyTable": "Няма резултати",
        "sSearch": "Търсене: ",
        "sZeroRecords": "Няма резултати за това търсене",
        "sInfo": "Намерени са _TOTAL_ рецепти",
        "sInfoEmpty": "Намерени са 0 рецепти",
        "sInfoFiltered": " от _MAX_",
        "oPaginate": {
          "sFirst": "Първа",
          "sLast": "Последна",
          "sPrevious": "❰",
          "sNext": "❱"
        }
    }
};

$("#RecipesTable").DataTable(dataTableOptions);

$("tr").on("click", function(){
    var recipeId = $(this).data('recipe-id');
    window.location.href = '/recipe/' + recipeId + '?sharedRecipe=true';
})
