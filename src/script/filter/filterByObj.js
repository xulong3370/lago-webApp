/**
 * Created by lianzhiyu on 2017/6/30.
 */
'use strict';
angular.module('app').filter('filterByObj',[function () {
    return function (list,obj) {
        var result = [];
        angular.forEach(list,function (item) {
            var isEqual = true;
            for(var e in obj){   //这样遍历的是里面的id
                if(item[e] !== obj[e]){
                    isEqual = false;
                }
            }
            if (isEqual){
                result.push(item);
            }
        });
        return result;
    }
}]);