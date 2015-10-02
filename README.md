# angular-material-modular-starter
angularjs and ngMaterial starter app with modular structure, and more


#Whats inside ?
HTML5 boilerplate
Angularjs
ngMaterial + icons + SVG-Morpheus
ui-router
simple gulp that injects all your modules and bower's js and css into index.html.

# Structure

all your work should be inside /modules dir.

to create a new, just add a new folder inside ```modules/new_module```
create js file
<pre>
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
</pre>

dont forget to:
<pre> npm install --save && bower install --save </pre>
