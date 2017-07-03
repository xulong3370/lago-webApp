/**
 * Created by lianzhiyu on 2017/6/29.
 */
'use strict';
angular.module('app').directive('appCompany',[function () {
    return {
        restrict:'A',
        replace:true,
        scope:{
          com:'='
        },
        templateUrl:'view/template/company.html'
    };
}]);