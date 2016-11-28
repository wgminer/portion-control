console.log('Soundspy injected. Waiting for page to load...');

var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === 'complete') {

        clearInterval(readyStateCheckInterval);

        var setupTransferEvent = function () {
            console.log('Watching');

            var injectTransferHandler = function () {

                var transferData = $('#transfer')[0].dataset;

                if (transferData.complete) {
                    
                    $('#transfer').unbind('DOMSubtreeModified', injectTransferHandler);

                    chrome.storage.local.get(['ss_messageRoute'], function(items) {
                        
                        chrome.storage.local.set({
                            ss_authToken: transferData.token, 
                            ss_uid: transferData.uid,
                            ss_friends: JSON.parse(transferData.friends ? transferData.friends : [])
                        }, function () {
                            chrome.runtime.sendMessage({redirect: 'chrome-extension://' + ss_config.id + '/index.html#' + items.ss_messageRoute});
                        });
                    });
                }
            }

            injectTransferHandler();

            $('#transfer').bind('DOMSubtreeModified', injectTransferHandler)
        }

        var currentlyPlaying = false;
        var setupPlayControlWatcher = function () {
            $('.playControls').bind('DOMSubtreeModified', function(e) {
                if (e.target.innerHTML.length > 0) {

                    $title = $('.playbackSoundBadge__title');
                    $artwork = $('.playbackSoundBadge__avatar span')[0].style.backgroundImage;
                    var src = $artwork.split('"')[1].replace(/50x50/g, '200x200');;
                    var href = $title.attr('href');

                    if (href) {

                        var playing = {
                            title: $title.attr('title'),
                            url: 'https://soundcloud.com' + $title.attr('href'),
                            artwork: src,
                            timestamp: Date.now()
                        }

                        if (currentlyPlaying === false || currentlyPlaying.url !== playing.url) {
                            sendToBackground(playing)
                        }
                    }
                }
            });
        }

        if (window.location.pathname == '/authentication.html') {
            setupTransferEvent();
        } else {
            setupPlayControlWatcher();
        }

    }
}, 10);
