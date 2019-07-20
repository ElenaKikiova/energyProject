var app = angular.module('RecipeApp', []);

app.controller('RecipeController', function($scope) {
    $scope.InitialRecipeBlocks; // Save initial blocks of the entire recipe
    $scope.InitialIngredientBlocks = []; // Save initial blocks of every ingredient, and multiply by changeRatio for a result
    $scope.InitialIngredientWeight = []; // Save initial weight of every ingredient, and multiply by changeRatio for a result
    $scope.InitialUserDishWeight; // Save initial weight of the user dish, and multiply by changeRatio for a result
    $scope.IngredientBlocks = []; // For current ingredients blocks display only, not used in calculation
    $scope.IngredientWeight = []; // For current ingredients weight display only, not used in calculation
    $scope.UserDishWeight; // For current dish weight display only, not used in calculation
    $scope.RecipeBlocks; // For current blocks of the recipe display only, not used in calculation

    $scope.changeRecipeBlocks = function(){
        console.log($scope.RecipeBlocks);
        if($scope.RecipeBlocks <= 1) $scope.RecipeBlocks = 1;
        // Calculate the ratio of initial blocks / new blocks
        var changeRatio = $scope.RecipeBlocks / $scope.InitialRecipeBlocks;

        // Multiply every ingredient's blocks and weight by changeRatio
        for(var i = 0; i < $scope.IngredientBlocks.length; i++){
            $scope.IngredientWeight[i] = parseInt($scope.InitialIngredientWeight[i] * changeRatio);
            $scope.IngredientBlocks[i] = ($scope.InitialIngredientBlocks[i] * changeRatio).toFixed(1);
        }
        $scope.UserDishWeight = parseInt($scope.InitialUserDishWeight * changeRatio);
    };

});
