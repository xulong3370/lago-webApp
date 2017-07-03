/**
 * Created by lianzhiyu on 2017/6/29.
 */
'use strict';
angular.module('app').directive('appPositionList',['$http',function ($http) {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'view/template/positionList.html',
        scope:{
            data:'=',
            filterObj: '=',
            isFavorite:'='
        },
        //指令作为控制器的一个子元素，data是指令的数据
        link:function ($scope) {
            $scope.select = function (item) {
                $http.post('data/favorite.json',{
                    id:item.id,
                    select:!item.select
                }).then(function () {
                item.select = !item.select;
                });
            };
        }
    };
}]);