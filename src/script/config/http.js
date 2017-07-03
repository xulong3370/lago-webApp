/**
 * Created by lianzhiyu on 2017/7/3.
 */
'use strict';
angular.module('app').config(['$provide',function ($provide) {
    $provide.decorator('$http',['$delegate','$q',function ($delegate,$q) {
        $delegate.post = function (url,data,config) {
            var def = $q.defer();
            $delegate.get(url).then(function (resq) {
                def.resolve(resq);
            }).catch(function (err) {
                def.reject(err);
            });
            return {
                then:function (cb) {
                    def.promise.then(cb);
                },
                catch:function (cb) {
                    def.promise.then(null,cb);
                }
            }
        };
        return $delegate;
    }]);
}]);