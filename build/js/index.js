/**
 * Created by lianzhiyu on 2017/6/28.
 */
'use strict';

angular.module('app',['ui.router','ngCookies','validation','ngAnimate']);

/**
 * Created by lianzhiyu on 2017/6/30.
 */
'use strict';
angular.module('app').value('dict',{}).run(['dict','$http',function (dict,$http) {
    $http.get('data/city.json').then(function (resp) {
        dict.city = resp.data;
    }) ;
    $http.get('data/salary.json').then(function (resp) {
        dict.salary = resp.data;
    }) ;
    $http.get('data/scale.json').then(function (resp) {
        dict.scale = resp.data;
    });
}]);
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
/**
 * Created by lianzhiyu on 2017/6/28.
 */
'use strict';

angular.module('app').config(['$stateProvider','$urlRouterProvider',function ($stateProvider,$urlRouterProvider) {
$stateProvider.state('main',{
    url:'/main',
    templateUrl:'view/main.html',
    controller:'mainCtrl'
}).state('position',{
    url:'/position/:id',
    templateUrl:'view/position.html',
    controller:'positionCtrl'
}).state('company',{
    url: '/company/:id',
    templateUrl:'view/company.html',
    controller:'companyCtrl'
}).state('search',{
    url:'/search',
    templateUrl:'view/search.html',
    controller:'searchCtrl'
}).state('login', {
    url: '/login',
    templateUrl: 'view/login.html',
    controller: 'loginCtrl'
}).state('register', {
    url: '/register',
    templateUrl: 'view/register.html',
    controller: 'registerCtrl'
}).state('me', {
    url: '/me',
    templateUrl: 'view/me.html',
    controller: 'meCtrl'
}).state('post', {
    url: '/post',
    templateUrl: 'view/post.html',
    controller: 'postCtrl'
}).state('favorite', {
    url: '/favorite',
    templateUrl: 'view/favorite.html',
    controller: 'favoriteCtrl'
});
$urlRouterProvider.otherwise('main');
}]);
/**
 * Created by lianzhiyu on 2017/7/2.
 */
'use strict';
//provider用于配置
angular.module('app').config(['$validationProvider',function ($validationProvider) {
    var expression = {
        phone: /^1[\d]{10}$/,
        password: function(value) {
            var str = value + '';
            return str.length > 5;
        },
        required: function(value) {
            return !!value;
        }
    };
    var defaultMsg = {
        phone: {
            success: '',
            error: '必须是11位手机号'
        },
        password: {
            success: '',
            error: '长度至少6位'
        },
        required: {
            success: '',
            error: '不能为空'
        }
    };
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);


}]);
/**
 * Created by lianzhiyu on 2017/6/28.
 */
'use strict';

angular.module('app').controller('companyCtrl', ['$http',  '$state','$scope',function($http,$state,$scope){
    $http.get('data/company.json?id='+$state.params.id).then(function (resp) {
        $scope.company = resp.data;
    });
}]);
'use strict';
angular.module('app').controller('favoriteCtrl', ['$http', '$scope', function($http, $scope){
  $http.get('data/myFavorite.json').then(function(resp) {
    $scope.list = resp.data;
  });
}]);

'use strict';
angular.module('app').controller('loginCtrl', ['cache', '$state', '$http', '$scope', function(cache, $state, $http, $scope){
  $scope.submit = function() {
    $http.post('data/login.json', $scope.user).then(function(resp){
      cache.put('id',resp.data.id);
      cache.put('name',resp.data.name);
      cache.put('image',resp.data.image);
      $state.go('main');
    });
  }
}]);

/**
 * Created by lianzhiyu on 2017/6/28.
 */
'use strict';

angular.module('app').controller('mainCtrl', ['$http', '$scope', function($http, $scope){
    $http.get('/data/positionList.json').then(function(resp){
        $scope.list = resp.data;
    });
}]);
'use strict';
angular.module('app').controller('meCtrl', ['$state', 'cache', '$http', '$scope', function($state, cache, $http, $scope){
  if(cache.get('name')) {
    $scope.name = cache.get('name');
    $scope.image = cache.get('image');
  }
  $scope.logout = function() {
    cache.remove('id');
    cache.remove('name');
    cache.remove('image');
    $state.go('main');
  };
}]);

/**
 * Created by lianzhiyu on 2017/6/28.
 */
'use strict';

angular.module('app').controller('positionCtrl', ['$q','$log','$http', '$state','$scope','cache',
    function($q,$log,$http, $state,$scope,cache){
        $scope.isLogin = !!cache.get;
        $scope.message = $scope.isLogin?'投个简历':'去登录';
        function getPosition(){
            var def = $q.defer();
            $http.get('data/position.json',{
                params:{
                    id:$state.params.id
                }
            }).then(function (resp) {
                $scope.position = resp.data;
                if(resp.data.posted) {
                    $scope.message = '已投递';
                }
                def.resolve(resp);
            }).catch(function (err) {
                def.reject(err);
            });
            return def.promise;
        }

        function getCompany(id) {
            $http.get('data/company.json?id='+id).then(function (resp) {
                $scope.company = resp.data;
            })
        }
        getPosition().then(function(obj){
            getCompany(obj.data.companyId)
        });
        $scope.go = function () {
            if ($scope.message !== '已投递') {
                if ($scope.isLogin) {
                    $http.post('data/handle.json', {
                        id: $scope.position.id
                    }).then(function (resp) {
                        $log.info(resp);
                        $scope.message = '已投递';
                    });
                } else {
                    $state.go('login');
                }
            }
        }
    }]);
'use strict';
angular.module('app').controller('postCtrl', ['$http', '$scope', function($http, $scope){
  $scope.tabList = [{
    id: 'all',
    name: '全部'
  }, {
    id: 'pass',
    name: '面试邀请'
  }, {
    id: 'fail',
    name: '不合适'
  }];
  $http.get('data/myPost.json').then(function(res){
    $scope.positionList = res.data;
  });
  $scope.filterObj = {};
  $scope.tClick = function(id, name) {
    switch (id) {
      case 'all':
        delete $scope.filterObj.state;
        break;
      case 'pass':
        $scope.filterObj.state = '1';
        break;
      case 'fail':
        $scope.filterObj.state = '-1';
        break;
      default:

    }
  }
}]);

'use strict';
angular.module('app').controller('registerCtrl', ['$interval', '$http', '$scope', '$state', function($interval, $http, $scope, $state){
  $scope.submit = function() {
    $http.post('data/regist.json',$scope.user).then(function(resp){
      $state.go('login');
    });
  };
  var count = 60;
  $scope.send = function() {
    $http.get('data/code.json').then(function(resp){
      if(1===resp.data.state) {
        count = 60;
        $scope.time = '60s';
        var interval = $interval(function() {
          if(count<=0) {
            $interval.cancel(interval);
            $scope.time = '';
          } else {
            count--;
            $scope.time = count + 's';
          }
        }, 1000);
      }
    });
  }
}]);

/**
 * Created by lianzhiyu on 2017/6/28.
 */
'use strict';

angular.module('app').controller('searchCtrl', ['dict','$http',  '$state','$scope',function(dict,$http,$state,$scope){
    $scope.name = '';
    $scope.search = function () {
    $http.get('data/positionList.json?name='+$scope.name).then(function (resp) {
        $scope.positionList = resp.data;
    });
    };
    $scope.search();
    $scope.sheet = {};
    $scope.tabList = [{
        id: 'city',
        name: '城市'
    },{
        id: 'salary',
        name: '薪水'
    },{
        id: 'scale',
        name: '公司规模'
    }];
    $scope.filterObj = {};
    var tabId = '';
    $scope.tClick = function (id,name) {
        tabId = id;
        $scope.sheet.list = dict[id];
        $scope.sheet.visible = true;
    };

    $scope.sClick = function (id,name) {
        if(id){
            angular.forEach($scope.tabList,function (item) {
                if(item.id === tabId){
                    item.name = name;
                }
            });
            $scope.filterObj[tabId + 'Id'] = id;
        }else{
            delete $scope.filterObj[tabId+'Id'];
            angular.forEach($scope.tabList,function (item) {
                if(item.id === tabId){
                    switch(item.id){
                        case 'city':
                            item.name = '城市';
                            break;
                        case 'salary':
                            item.name = '薪水';
                            break;
                        case 'scale':
                            item.name = '公司规模';
                            break;
                        default:
                    }
                }
            });
        }
    }
}]);

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
/**
 * Created by lianzhiyu on 2017/6/28.
 */
'use strict';
angular.module('app').directive('appHead',['cache',function (cache) {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'view/template/head.html',
        link:function ($scope) {
            $scope.name = cache.get('name') || '';
        }
    }
}]);
/**
 * Created by lianzhiyu on 2017/6/28.
 */
'use strict';
angular.module('app').directive('appHeadBar',[function () {
    return {
        restrict:'A',
        replace:true,
        templateUrl:'view/template/headBar.html',
        scope:{
            text:'@'
        },
        link:function ($scope) {
            $scope.back = function(){
              window.history.back();
            };
        }
    }
}]);
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
/**
 * Created by lianzhiyu on 2017/6/29.
 */
'use strict';
angular.module('app').directive('appPositionInfo',['$http',function ($http) {
    return{
        restrict:'A',
        replace:true,
        templateUrl:'view/template/positionInfo.html',
        scope:{
            isActive:'=',
            isLogin:'=',
            pos:'='
        },
        link:function ($scope) {
            $scope.$watch('pos',function (newValue) {
                if(newValue){
            $scope.pos.select = $scope.pos.select || false;
            $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
                }
            });
            $scope.favorite = function () {
                $http.post('data/favorite.json',{
                    id:$scope.pos.id,
                    select:!$scope.pos.select
                }).then(function (resp) {
                    $scope.pos.select = !$scope.pos.select;
                $scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
            });
        }
        }
    }
}]);
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
/**
 * Created by lianzhiyu on 2017/6/29.
 */
'use strict';
angular.module('app').service('cache',['$cookies',function ($cookies) {
    this.put = function (key,value) {
        $cookies.put(key,value);
    };
    this.get = function (key) {
        return $cookies.get(key)
    };
    this.remove = function (key) {
        $cookies.remove(key);
    }
}]);

