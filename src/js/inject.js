// 10 minute default
var snoozeDuration = 10 * 60 * 1000;
chrome.storage.sync.get('snoozeDuration', function(items) {
	if (items.snoozeDuration) {
    	snoozeDuration = items.snoozeDuration;
	}
});

function sample(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function showOverlay (url, veggies) {
	var body = document.getElementsByTagName('body')[0];
	body.style.overflow = 'hidden';
	
	var overlay = '<div id="portion-control"><div><h1>Try these healthy options instead!</h1><ul>';

	if (veggies.length > 3) {
		veggies = sample(veggies, 3);
	}

	veggies.forEach(function (veg) {
		overlay += '<li><a href="' + veg + '">' + veg + '</a></li>';
	});

	overlay += '</ul><button id="remove-overlay">Nah, not right now</button></div></div>';

	body.innerHTML += overlay;

	setTimeout(function(){
	   	document.getElementById("remove-overlay").addEventListener('click', function () {
	   		removeOverlay(url);
	   	});
	}, 10);
}

function removeOverlay (url) {
	var body = document.getElementsByTagName('body')[0];
	body.style.overflow = '';
	document.getElementById('portion-control').remove();

	chrome.storage.sync.get('snoozed', function(items) {
		var snoozed = items.snoozed 
		if (typeof snoozed == 'undefined') snoozed = {};
	    snoozed[url] = Date.now() + snoozeDuration;
	    chrome.storage.sync.set({
	        snoozed: snoozed
	    }, function() {
	        console.log(snoozed);
	    });

	});

}

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
	    	for (var i = 0; i < items.junkFood.length; i++) {
	    		var url = items.junkFood[i];

	    	    if (window.location.href.indexOf(url) > -1) {

	    	    	console.log('Match with ' + url);
	    	    	
	    	    	if (!isSnoozed(items.snoozed, url)) {
	    	    		
	    	    		console.log('Not snoozed!');
	    	    		showOverlay(url, items.veggies);

	    	    		break;
	    	    	}
	    	    }
	    	}
	    }
    });

});