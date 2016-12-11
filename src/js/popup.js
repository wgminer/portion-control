var app = angular.module('soundspy', ['firebase', 'ui.router', 'angularMoment']);

app.config(function ($compileProvider, $stateProvider, $urlRouterProvider) {   

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);

    $urlRouterProvider
        .otherwise('/loading');
    $stateProvider
        .state('onboard', {
            url: '/onboard',
            templateUrl: 'views/onboard.html'
        })
        .state('find-friends', {
            url: '/find-friends',
            templateUrl: 'views/find-friends.html',
            controller: 'FindFriendsCtrl'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: 'views/signup.html',
            controller: 'AuthCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'AuthCtrl'
        })
        .state('feed', {
            url: '/feed',
            templateUrl: 'views/feed.html',
            controller: 'FeedCtrl'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'views/profile.html'
        })
        .state('loading', {
            url: '/loading',
            templateUrl: 'views/loading.html'
        });
});

app.run(function ($rootScope, $firebaseArray, $window, $state) {

    var ref = new Firebase(ss_config.firebaseUrl + '/users');

    $rootScope.user = false;

    var handleNotAuthed = function () {
        chrome.storage.local.set({ss_authToken: null, ss_uid: null});
        ref.unauth();
        $state.go('login');
    }

    var handleAuth = function (authToken, state) {
        // Check firebase auth next
        ref.authWithCustomToken(authToken, function(error, authData) {
            if (error) {
                handleNotAuthed();
            } else {
                $rootScope.authData = ref.getAuth();
                $state.go(state);
            }
        });
    }

    var init = function () {

        chrome.storage.local.get(['ss_authToken', 'ss_uid', 'ss_popupState'], function(items) {
            
            var authToken = items.ss_authToken || null;
            var uid = items.ss_uid || null;
            var state = items.ss_popupState || 'feed';

            console.log(items);

            if (state == 'onboard') {
                $state.go(state);
            } else {
                if (authToken && uid) {
                    handleAuth(authToken, state);
                } else {
                    handleNotAuthed();
                }
            }
        });
    }

    init();

    $rootScope.logout = function () {
        handleNotAuthed();
    }

});

app.controller('AuthCtrl', function ($scope, $rootScope, $window) {
    $scope.redirectToAuth = function (messageRoute, popupState) {

        chrome.storage.local.set({ss_messageRoute: messageRoute, ss_popupState: popupState});
        // check if on the welcome tab or not else update or create new
        chrome.tabs.update(null, {url: ss_config.siteUrl + '/authentication.html'});
        $window.close();
    }
});

app.controller('FeedCtrl', function ($scope, $rootScope, $firebaseArray) {
    var ref = new Firebase(ss_config.firebaseUrl + '/users');
    $scope.feed = $firebaseArray(ref.child($rootScope.authData.uid + '/following'));
    console.log($scope.feed);
});

app.controller('FindFriendsCtrl', function ($scope, $rootScope, $firebaseArray) {
    chrome.storage.local.get(['ss_friends'], function(items) {
        console.log(items);
    });
});

app.directive('item', function ($location) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            $(element).focus();
        }
    }
});

// app.directive('a', function ($location) {
//     return {
//         restrict: 'E',
//         link: function (scope, element, attrs) {
//             $(element).click(function(){
//                 chrome.tabs.create({url: $(this).attr('href')});
//                 return false;
//             });
//         }
//     }
// });