/**
 * Created by lianzhiyu on 2017/6/29.
 */
'use strict';
angular.module('app').directive('appSheet',[function () {
    return {
        restrict:'A',
        replace:true,
        scope:{
            list: '=',
            visible:'=',
            select:'&'
        },
        templateUrl:'view/template/sheet.html'
    }
}]);