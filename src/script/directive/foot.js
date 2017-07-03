/**
 * Created by lianzhiyu on 2017/6/29.
 */
'use strict';

angular.module('app').directive('appFoot',[function () {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'view/template/foot.html'
    }
}]);