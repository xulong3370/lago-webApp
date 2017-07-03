/**
 * Created by lianzhiyu on 2017/6/28.
 */
'use strict';

angular.module('app').controller('mainCtrl', ['$http', '$scope', function($http, $scope){
    $http.get('/data/positionList.json').then(function(resp){
        $scope.list = resp.data;
    });
}]);