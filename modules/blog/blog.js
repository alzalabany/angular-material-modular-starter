angular.module('app.blog', ['app.core'])
.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    
    $stateProvider
    .state('appblog', {
        url: "/blog",
        templateUrl: "modules/blog/blog.html"
    });
    
})

.run(function($rootScope, $state, $user,$http,$oauth) {
    $rootScope.$homepage = $rootScope.$homepage || 'appblog';//Set homepage to me if no one else declared it.
});