angular.module('zalabany',['app.core','app.wall','app.blog']);
angular.module('app.core', ['ui.router', 'ngAnimate', 'toastr', 'ngMaterial','ngMdIcons'])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    ///http interceptor in case 403,401 on any request, redirect to login right away.
    $httpProvider.interceptors.push(function($q, $rootScope, $injector, $timeout, $window) {
        var toastr, $state, $http;
        //timeout is used to prevent circuler dependency error !
        $timeout(function() {
            toastr = $injector.get('toastr');
            $http = $injector.get('$http');
            $state = $injector.get('$state');
        });
        return {
            responseError: function(rejection) {
                if (rejection.data && rejection.data.hasOwnProperty('message')) {
                    toastr.error('request failed. try again later');
                }
                if (rejection.status === 401 || rejection.status === 403) {
                    console.log('rejected and redirecting', rejection);
                    $state.go('login');
                }
                return $q.reject(rejection);
            }
        };
    });
    
    $urlRouterProvider.otherwise("/login");

    $stateProvider
    .state('login', {
        url: "/login",
        templateUrl: "modules/core/login.html"
    });

    console.log('im config core');

})

.controller('loginCtrl', function($scope,$http,$oauth,$user,$rootScope){
    var self=this;
    this.success = false;
    this.pageready = true;
    this.username = $user.username;

    function doLogin(r){
        self.success = {'icon':'verified_user',color:'green','msg':'Welcome ..'};
        $rootScope.Login(r);
    }

    if($user.token && $user.id){
        //validate token by sending get to auth.
        $http.defaults.headers.common["auth-token"] = $user.token;
        $http.defaults.headers.common["auth-uid"] = $user.id;
        
        $http.get($oauth).then(function(){$rootScope.Login($user);},$rootScope.Logout);

    }

    this.login= function(){
        self.pageready = false;
        this.success = false;
        $http.post($oauth,{username:self.username,password:self.password,app:'riada.ischool','version':1})
            .then(function(r){
                doLogin(r.data);
            },function(e){
                self.success = {'icon':'error',color:'red','msg':e.data.message};
            }).finally(function(){
                self.pageready=true;
            });
    }
})

.run(function($rootScope, $state, $user,$http,$oauth) {
    console.log('im runing core');
    $rootScope.$user = $user;
    
    $rootScope.$homepage = null;//default. child should overide it;

    $rootScope.$watch('$homepage',function(n,o){
        console.log('homepage set to ',n,' from:',o);
    });
    
    ///FUNTION 1.
    ///LISTEN FOR ROUTE CHANGE AND PREVENT IF USER IS NOT LOGGED IN
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        console.log('changin to',toState.name,' from ',fromState);
        if (!$rootScope.$user.hasOwnProperty('token') && toState.name !== 'login') {
            console.log('prevented');
            event.preventDefault();
            $state.go('login');
        }
    });


    $rootScope.Login = function(r){
        window.localStorage['iSchoolUID'] = $http.defaults.headers.common["auth-token"] = r.id;
        window.localStorage['iSchoolToken'] = $http.defaults.headers.common["auth-uid"] = r.token;
        window.localStorage['iSchoolUser'] = JSON.stringify(r);
        
        angular.module('zalabany').value('$user',r);
        
        console.log('oki lets go hom',$state.go($rootScope.$homepage));
        //$state.go($rootScope.$homepage);
    }

    $rootScope.Logout = function(){
        window.localStorage.clear();
        self.success = {'icon':'nature_people',color:'green','msg':'see you soon..'};
        angular.module('zalabany').value('$user',{username:$user.user});
    }

});


///BOOTSTRAP
$(function(){
    var data = {},
        api='http://app.riada.dev/',
        oauth='http://auth.riada.dev/',$user={};

    data.user = window.localStorage['iSchoolUser'] || false;
    data.token = window.localStorage['iSchoolToken'] || false;
    data.uid = window.localStorage['iSchoolUID'] || false;

    $.ajaxSetup({headers : {'auth-token' : data.token,'auth-uid' : data.uid}});
    //console.log('loading ..',server+'me/groups');
    $.getJSON(api+'me', function(json) {
        $user = json || data;
    }).fail(function() {
        $user=data;
        window.localStorage.clear();
        console.log( "login error" );
    }).always(function() {
        window.localStorage['iSchoolUID'] = data.uid;
        window.localStorage['iSchoolToken'] = data.token;
        window.localStorage['iSchoolUser'] = data.user;
        angular.module('app.core')
                .value('$user',$user)
                .constant('$api', api)
                .constant('$oauth', oauth);
        angular.bootstrap(document, ['zalabany']);
    });
});