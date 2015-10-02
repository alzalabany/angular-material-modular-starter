angular.module('app.wall', ['app.core'])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    
    $stateProvider
    .state('wall', {
        url: "/wall",
        templateUrl: "modules/wall/wall.html"
    });
})

.run(function($rootScope, $state, $user,$http,$oauth) {
    $rootScope.$homepage = 'wall';//Set homepage to me
});