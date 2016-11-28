(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var fbIntervalInt = setInterval(function() {

    if (typeof FB == 'object') {
        clearInterval(fbIntervalInt);

        FB._domain = {
            api : 'https://api.facebook.com/',
            cdn : 'https://s-static.ak.fbcdn.net/',
            www : 'https://www.facebook.com/'
        };

        console.log('success');
        FB.init({ 
            appId: '499211296937764',
            status: true, 
            cookie: true, 
            xfbml: true,
            version: 'v2.4'
        });
    }

}, 333);

