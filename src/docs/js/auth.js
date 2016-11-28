var ref = new Firebase('https://sound-spy.firebaseio.com');

var injectData = function (authData) {

    $('#transfer').attr('data-uid', authData.uid);
    $('#transfer').attr('data-token', authData.token);

    FB.api('/me/friends', {
        access_token: authData.facebook.accessToken,
        fields: 'installed'
    }, function(response) {
        if (!response || response.error) {
           console.log('An error occured!', response.error);
        } else {
            $('#transfer').attr('data-friends', JSON.stringify(response.data));
        }
        $('#transfer').attr('data-complete', 'true');
    });

}; 

var decomposeName = function (name) {
    var words = name.split(' ');
    words.push(name);
    var obj = {};
    words.forEach(function (word, i) {
        var letters = word.split('');
        var str = '';
        var compose = {};
        letters.forEach(function (letter) {
            str += letter;
            compose[str] = true;
        });
        $.extend(obj, compose);
    });
    return obj;
}

var createNewUser = function (authData) {

    var decomposeObj = decomposeName(authData.facebook.displayName);

    console.log(decomposeObj);

    ref.child('decompose/' + authData.uid).set(decomposeObj, function () {
        ref.child('users/' + authData.uid).set({
            'name': authData.facebook.displayName,
            'email': authData.facebook.email,
            'picture': authData.facebook.profileImageURL
        }, injectData(authData));
    });  
};

var handleAuth = function () {
    ref.authWithOAuthPopup('facebook', function(error, authData) {
        if (error) {
            console.log("Authentication Failed!", error);
        } else {
            ref.child('users/' + authData.uid)
                .on('value', function(snapshot) {
                    console.log(snapshot);
                    if (snapshot.exists() == false) {
                        createNewUser(authData);
                    } else {
                        injectData(authData);
                    }
                });
            console.log(authData);
        }
    }, {
        scope: 'email,user_friends'
    });
}

var init = function () {
    ref.unauth();
    var authData = ref.getAuth();
    if (authData) {
        injectData(authData);
    } else {
        handleAuth();
    }
};

init();