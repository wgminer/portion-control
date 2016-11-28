var app = angular.module('soundspy', ['firebase', 'angularMoment']);

app.run(function ($rootScope, $window, $firebaseObject, $firebaseArray, Facebook) {

    var ref = new Firebase('https://sound-spy.firebaseio.com');
    $rootScope.authData = ref.getAuth();

    if ($rootScope.authData) {
        $rootScope.user = $firebaseObject(ref.child('users/' + $rootScope.authData.uid));
    }

    Facebook.init();

});


app.controller('IndexCtrl', function ($scope, $rootScope, $interval, $timeout) {

    var users = [
        {
            "picture": "https://randomuser.me/api/portraits/med/women/1.jpg",
            "name": "Miriam King",
            "playing": {
                "artwork": "https://i1.sndcdn.com/artworks-000143050783-0p20sv-large.jpg",
                "title": "Purity Ring - Bodyache (LIONE Remix)",
                "url": "http://soundcloud.com/iamlione/purity-ring-bodyache-lione-remix",
                "username": "LIONE"
            }
        },
        {
            "picture": "https://randomuser.me/api/portraits/med/women/2.jpg",
            "name": "Maeva Wilson",
            "playing": {
                "artwork": "https://i1.sndcdn.com/artworks-000124020435-gc80as-large.jpg",
                "title": "Aprés - Chicago (Technimatic Remix)",
                "url": "http://soundcloud.com/ukf/apres-chicago-technimatic-remix",
                "username": "UKF"
            }
        },
        {
            "picture": "https://randomuser.me/api/portraits/med/women/3.jpg",
            "name": "Claire Michel",
            "playing": {
                "artwork": "https://i1.sndcdn.com/artworks-000131296105-7oxlhr-large.jpg",
                "title": "Lxury & LA Priest - Show",
                "url": "http://soundcloud.com/greco-roman/lxury-la-priest-show",
                "username": "Greco-Roman"
            }
        },
        {
            "picture": "https://randomuser.me/api/portraits/med/women/4.jpg",
            "name": "Hannah Hall",
            "playing": {
                "artwork": "https://i1.sndcdn.com/artworks-000131738028-3nc4zo-large.jpg",
                "title": "Allure - By Surprise",
                "url": "http://soundcloud.com/allureproduction/allure-by-surprise",
                "username": "ALLURE"
            }
        },
        {
            "picture": "https://randomuser.me/api/portraits/med/men/1.jpg",
            "name": "John Pierce",
            "playing": {
                "artwork": "https://i1.sndcdn.com/artworks-000140468121-fcfcjv-large.jpg",
                "title": "ABGT 162 - Moon Boots Guest Mix",
                "url": "http://soundcloud.com/moonbootsmusic/abgt-162-moon-boots-guest-mix",
                "username": "Moon Boots"
            }
        },
        {
            "picture": "https://randomuser.me/api/portraits/med/men/2.jpg",
            "name": "Jordan Brunet",
            "playing": {
                "artwork": "https://i1.sndcdn.com/artworks-000022342159-njw096-large.jpg",
                "title": "Foster The People - Don't Stop (Oliver Remix)",
                "url": "http://soundcloud.com/weareoliver/foster-the-people-dont-stop",
                "username": "weareoliver"
            }
        },
        {
            "picture": "https://randomuser.me/api/portraits/med/men/3.jpg",
            "name": "Alex Schuster",
            "playing": {
                "artwork": "https://i1.sndcdn.com/artworks-000022342159-njw096-large.jpg",
                "title": "Foster The People - Don't Stop (Oliver Remix)",
                "url": "http://soundcloud.com/weareoliver/foster-the-people-dont-stop",
                "username": "weareoliver"
            }
        },
        {
            "picture": "https://randomuser.me/api/portraits/med/men/4.jpg",
            "name": "Oliver Tolonen",
            "playing": {
                "artwork": "https://i1.sndcdn.com/artworks-000140468121-fcfcjv-large.jpg",
                "title": "ABGT 162 - Moon Boots Guest Mix",
                "url": "http://soundcloud.com/moonbootsmusic/abgt-162-moon-boots-guest-mix",
                "username": "Moon Boots"
            }
        }
    ];

    var users = _.shuffle(users);
    $scope.feed = users.slice(0, 5);

    var i; 
    for(i = 0; i < $scope.feed.length; i++) {
        $scope.feed[i].playing.started_at = (Date.now() - (i * 36000));
    }

    var inject = $interval(function () {
        
        var newUser = users[i]
        newUser.playing.started_at = Date.now();
        $scope.feed.unshift(newUser);
        $scope.feed.pop();
        i++;

        if ($scope.feed.length == i - 1) {
            $interval.cancel(inject);
        }

    }, 2500);

});

app.controller('AuthCtrl', function ($scope, $rootScope, $window, $firebaseObject, $firebaseArray) {

    var appId = location.search.split('id=')[1];
    var callbackUrl = 'chrome-extension://' + appId + '/index.html#/login-successful';
    var ref = new Firebase('https://sound-spy.firebaseio.com/users');

    var navigateToExtension = function () {
        chrome.tabs.create({url: callbackUrl});
    }

    var injectAuthData = function (authData, callback) {
        $('#uid').text(authData.uid);
        $('#token').text(authData.token);
        // now we wait for redirect from inject script...
    }; 

    var createNewUser = function (authData, callback) {
        ref.child(authData.uid).set({
            'name': authData.facebook.displayName,
            'email': authData.facebook.email,
            'picture': authData.facebook.profileImageURL
        }, callback(authData));
    };

    var startLoginFlow = function () {
        ref.authWithOAuthRedirect('facebook', function(error, authData) {
            console.log(authData);
            if (error) {
                console.log('Login Failed!', error);
            } else {
                console.log(authData.uid);
                ref.child(authData.uid)
                    .on('value', function(snapshot) {
                        if (snapshot.exists() == false) {
                            createNewUser(authData, injectAuthData);
                        } else {
                            injectAuthData(authData);
                        }
                    });
            }
        }, {
            scope: 'email,user_friends'
        });
    };

    var init = function () {
        if ($rootScope.authData) {
            console.log($rootScope.authData);
            injectAuthData($rootScope.authData, function () {
                console.log(callbackUrl);
                navigateToExtension();
            });
        } else {
            startLoginFlow();
        }
    }

    init();

});

// app.config(function ($stateProvider, $urlRouterProvider) {

//     $urlRouterProvider
//         .otherwise('/following');
//     $stateProvider
//         .state('following', {
//             url: '/following',
//             templateUrl: 'templates/following.html'
//         })
//         .state('followers', {
//             url: '/followers',
//             templateUrl: 'templates/followers.html'
//         })
//         .state('settings', {
//             url: '/settings',
//             templateUrl: 'templates/settings.html'
//         })
        
// });

app.controller('ProfileCtrl', function ($scope, $rootScope, $window, $firebaseObject, $firebaseArray, Facebook) {

    console.log($rootScope.authData);

    Facebook.getAppFriends($rootScope.authData.facebook.accessToken)
        .then(function (response) {
            console.log(response);
        });

    $scope.user = false;

    var ref = new Firebase('https://sound-spy.firebaseio.com');
    var authData = ref.getAuth();

    $scope.invite = function () {
        console.log("yo");
        Facebook.inviteFriends('Try out my new app Soundspy')
            .then(function (response) {
                console.log(response);
            });
    }

    $scope.logout = function (e) {
        ref.unauth();
        $window.location.href = 'http://localhost:3000/logout.html';
        e.preventDefault();
    }

    if (authData) {
        $scope.user = $firebaseObject(ref.child('users/' + authData.uid));
        $scope.following = $firebaseArray(ref.child('users/' + authData.uid + '/following'));
        $scope.followers = $firebaseArray(ref.child('users/' + authData.uid + '/followers'));
    } else {
        $window.location.href = 'http://localhost:3000/login.html';
    }

});

app.controller('FindFriendsCtrl', function ($scope, $rootScope, $window, $firebaseObject, $firebaseArray) {

});

app.directive('tabs', function ($location) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            var setTabs = function () {
                var segments = $location.path().split('/');
                scope.activeTab = segments[segments.length - 1];
                console.log(scope.activeTab);
            }

            setTabs();
            scope.$on('$stateChangeSuccess', function(){
                setTabs();
            });
        }
    }
});

app.factory('Facebook', function($q, $window, $interval) {

    var module = {};

    module.isInitalized = false;

    module.init = function () {

        var deferred = $q.defer();

        (function(d, s, id) {
             var js, fjs = d.getElementsByTagName(s)[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement(s); js.id = id;
             js.src = "//connect.facebook.net/en_US/sdk.js";
             fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        $window.fbAsyncInit = function() {

            FB.init({ 
              appId: '499211296937764',
              status: true, 
              cookie: true, 
              xfbml: true,
              version: 'v2.4'
            });

            module.isInitalized = true;
            deferred.resolve('Facebook initalized');

        };

        return deferred.promise;
    }

    var waitForFacebook = function (fn) {

    }

    module.getAppFriends = function (token) {

        var deferred = $q.defer();

        if (module.isInitalized) {
            FB.api('/me/friends', 'GET', {
                access_token: token,
                fields: 'installed'
            }, function(response) {
                if (!response || response.error) {
                    deferred.reject('An error occurred');
                } else {
                    deferred.resolve(response);
                }
            });
        } else {
            var i = 0;
            var isReady = $interval(function () {

                if (typeof FB != 'undefined') {
                    $interval.cancel(isReady);

                    FB.api('/me/friends', 'GET', {
                        access_token: token,
                        fields: 'installed'
                    }, function(response) {
                        if (!response || response.error) {
                            deferred.reject('An error occurred');
                        } else {
                            deferred.resolve(response);
                        }
                    });
                } else if (i > 100) {
                    $interval.cancel(isReady);
                    deferred.reject('An error occurred');
                } else {
                    i++;
                }

            }, 200);
        }

        

        return deferred.promise;
    }

    module.inviteFriends = function (message) {

        var deferred = $q.defer();

        FB.ui({method: 'share',
             href: message
        }, function(response){
            if (!response || response.error) {
                deferred.reject('An error occurred');
            } else {
                deferred.resolve(response);
            }
        });

        return deferred.promise;
    }

    return module;

});