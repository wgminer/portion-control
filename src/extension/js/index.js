var app = angular.module('soundspy', ['firebase', 'ui.router', 'angularMoment']);

app.config(function ($compileProvider) {   
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
});

app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
        .otherwise('/following');
    $stateProvider
        .state('options', {
            url: '/options',
            templateUrl: 'views/options.html',
            controller: 'OptionsCtrl'
        })
        .state('message', {
            url: '/:message',
            templateUrl: 'views/message.html',
            controller: 'MessageCtrl'
        });
});

app.controller('OptionsCtrl', function ($scope, $rootScope, $stateParams, $timeout) {
    
    $scope.message = $stateParams.message;

});

app.controller('MessageCtrl', function ($scope, $rootScope, $stateParams, $timeout) {
    
    $scope.message = $stateParams.message;

});
