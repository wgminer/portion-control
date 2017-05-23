// 10 minute default
var snoozeDuration = 10 * 60 * 1000;
var buttonLocked = true;

chrome.storage.sync.get('snoozeDuration', function(items) {
	if (items.snoozeDuration) {
    	snoozeDuration = items.snoozeDuration;
	}
});
	
// function countdown (sec) {
// 	var $el = $('#remove-overlay');
//     var counter = setInterval(timer, 1000); //1000 will  run it every 1 second
//     function timer () {
//       	sec-=1;
//       	if (sec <= 0) {
//         	clearInterval(counter);
//         	$el.removeClass('is--loading');
//         	//counter ended, do something here
//         	return false;
//       	}
//       	$el.find('.countdown').text(sec);
//       	//Do code for showing the number of seconds here
//     }
// }

function showOverlay (url, veggies) {

    var title = _.sample([
        'Are you sure!?',
        'Try these healthy options!',
        'Feed your mind instead!',
        'Boo!',
        'Don\'t do it!',
        'Do something productive!'
    ]);
	
    var body = document.getElementsByTagName('body')[0];
	body.style.overflow = 'hidden';
	body.innerHTML += '<div id="pc"><div class="pc-container"><div id="pc-1" class="pc-sentence"></div></div></div>';

	setTimeout(function(){
		Typed.select('.pc-sentence', {
            strings: ['Want to do something healthy instead?'],
            typeSpeed: 0,
            showCursor: false
        });
	   	// document.getElementById("remove-overlay").addEventListener('click', function () {
	   	// 	removeOverlay(url);
	   	// });
	}, 10);
}

// function removeOverlay (url) {
// 	var body = document.getElementsByTagName('body')[0];
// 	body.style.overflow = '';
// 	document.getElementById('portion-control').remove();

// 	chrome.storage.sync.get('snoozed', function(items) {
// 		var snoozed = items.snoozed 
// 		if (typeof snoozed == 'undefined') snoozed = {};
// 	    snoozed[url] = Date.now() + snoozeDuration;
// 	    chrome.storage.sync.set({
// 	        snoozed: snoozed
// 	    }, function() {
// 	        console.log(snoozed);
// 	    });

// 	});

// }

function isSnoozed (snoozed, url) {
	var now = Date.now();
	if (snoozed && snoozed[url] && snoozed[url] > now) {
		console.log('But it\'s snoozed..');
		return true;
	}
	return false;
}

chrome.storage.sync.get(['veggies', 'junkFood', 'snoozed'], function (items) {

    var interval = setInterval(function () {
    	if (document.getElementsByTagName('body')[0]) {
    		clearInterval(interval);

    		if (typeof items.junkFood == 'undefined') return false;

	    	for (var i = 0; i < items.junkFood.length; i++) {
	    		var url = items.junkFood[i];

	    	    if (window.location.href.indexOf(url) > -1) {

	    	    	console.log('Match with ' + url);
	    	    	
	    	    	if (!isSnoozed(items.snoozed, url)) {
	    	    		
	    	    		console.log('Not snoozed!');
	    	    		showOverlay(url, items.veggies);
	    	    		countdown(10);

	    	    		break;
	    	    	}
	    	    }
	    	}
	    }
    });

});