/**
 * Created by lianzhiyu on 2017/6/29.
 */
'use strict';
angular.module('app').directive('appTab',[function () {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'view/template/tab.html',
        scope:{
            list: '=', //数据
            tabClick: '&'  //回掉函数(对象)
        },
        link: function ($scope) {
            $scope.click = function (tab) {
                $scope.selectId = tab.id;
                $scope.tabClick(tab);
            }
        }
    };
}]);