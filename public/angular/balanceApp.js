var app = angular.module('BalanceApp', []);

app.controller('BalanceController', function($scope) {
    $scope.IWeight = [];
    $scope.IBlocks = [];
    $scope.IValue = [];

    $scope.changeWeight = function(index){
        if(typeof $scope.IWeight[index] == "undefined") $scope.IWeight[index] = 0;
        $scope.IBlocks[index] = parseFloat(($scope.IWeight[index] / $scope.IValue[index]).toFixed(1));
    };

    $scope.changeBlocks = function(index){
        if(typeof $scope.IBlocks[index] == "undefined") $scope.IBlocks[index] = 0;
        $scope.IWeight[index] = parseInt($scope.IBlocks[index] * $scope.IValue[index]);
    };
});
