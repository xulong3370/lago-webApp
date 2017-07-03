/**
 * Created by lianzhiyu on 2017/6/29.
 */
'use strict';

angular.module('app').directive('appPositionClass',[function () {
    return{
        restrict:'A',
        replace:true,
        templateUrl:'view/template/positionClass.html',
        scope:{
         com:'='
        },
        link:function ($scope) {
            $scope.showPositionList = function (idx) {
                $scope.positionList = $scope.com.positionClass[idx].positionList;
                $scope.isActive = idx;
            };
            $scope.$watch('com', function(newVal,oldVal){
                 if(newVal) $scope.showPositionList(0);  //watch监视等待com值幅值出现，并执行该方法。否则无法判断先后
            });
        }
    };
}]);