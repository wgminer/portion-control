var Background = (function () {

    var module = {};
    var ref = new Firebase(ss_config.firebaseUrl + '/users');

    var saveToFireBase = function (uid, playing) {
        console.log(playing);
        ref.child(uid + '/playing')
            .set(playing);
        ref.child(uid + '/followers')
            .orderByChild('status')
            .equalTo('accepted')
            .once('value', function(snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var follower = childSnapshot.val();
                    follower.uid = childSnapshot.key();
                    ref.child(follower.uid + '/following/' + uid + '/playing')
                        .set(playing);
                });
            }); 
    }

    var initTypekit = function () {
        chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
            var requestHeaders = details.requestHeaders;
            for (var i=0; i<requestHeaders.length; ++i) {
                if (requestHeaders[i].name.toLowerCase() === 'referer') {
                    // The request was certainly not initiated by a Chrome extension...
                    return;
                }
            }
            // Set Referer
            requestHeaders.push({
                name: 'referer',
                // Host must match the domain in your Typekit kit settings
                value: 'https://' + ss_config.id + '/'
            });
            return {
                requestHeaders: requestHeaders
            };
        }, {
            urls: ['*://use.typekit.net/*'],
            types: ['stylesheet']
        }, ['requestHeaders','blocking']);
    }

    var initSoundcloud = function () {
        SC.initialize({
            client_id: ss_config.soundCloudAppId
        });
    }

    var initMessageListener = function () {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                console.log(request);

                if (typeof request.redirect != 'undefined') {
                    chrome.tabs.update(sender.tab.id, {url: request.redirect});
                } else {
                    sendResponse('Got it! Attempting to send "' + request.title + '" to FireBase');
                    chrome.storage.local.get(['ss_authToken', 'ss_uid'], function(items) {
                        
                        authToken = items.ss_authToken || null;
                        uid = items.ss_uid || null;

                        // console.log(uid);
                        
                        if (uid && authToken) {
                            SC.resolve(request.url)
                                .then(function (data) {
                                    
                                    if (data.artwork_url) {
                                        var artwork_url = data.artwork_url;
                                    } else {
                                        var artwork_url = data.user.avatar_url;
                                    }

                                    var playing = {
                                        url: data.permalink_url,
                                        artwork: artwork_url,
                                        title: data.title,
                                        username: data.user.username,
                                        started_at: Date.now()
                                    }

                                    console.log(data);

                                    // Send to FireBase
                                    saveToFireBase(uid, playing);

                                }, function (error) {

                                    var playing = {
                                        url: request.url,
                                        artwork: request.artwork,
                                        title: request.title,
                                        username: false,
                                        started_at: Date.now()
                                    }

                                    console.log(error, playing);

                                    // Send to FireBase
                                    saveToFireBase(uid, playing);

                                });
                        } else {
                            console.log("Shoot! Auth token is not set.");
                        }
                    });
                }
            }
        );
    }

    module.init = function () {

        // If extension has just been installed
        chrome.runtime.onInstalled.addListener(function(details){
            if (details.reason == 'install'){
                chrome.storage.local.set({ss_popupState: 'onboard'});
                chrome.tabs.create({url: chrome.extension.getURL('index.html#/welcome')});
            };
        });

        initTypekit();
        initSoundcloud();
        initMessageListener();

    }

    return module;

})();

Background.init();