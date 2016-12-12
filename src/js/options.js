$(function () {

    var parse = function (str) {
        var arry = str.split(',');
        return arry.map(function (item) { return item.trim() });
    }

    var stitch = function (arry) {
        return arry.reduce(function (a, b) { return a +=  ', ' + b });
    }

    var restore = function () {
        chrome.storage.sync.get({
            veggies: ['bbc.co.uk', 'test.com'],
            junkFood: ['facebook.com', 'reddit.com']
        }, function(items) {
            $('#veggies').val(stitch(items.veggies));
            $('#junk-food').val(stitch(items.junkFood));
        });
    }

    $('.js--save').click(function () {
        var $this = $(this);
        chrome.storage.sync.set({
            veggies: parse($('#veggies').val()),
            junkFood: parse($('#junk-food').val())
        }, function() {
            $this.text('Saved!').addClass('btn-success').attr('disabled', true);
            setTimeout(function () {
                $this.text('Save').removeClass('btn-success').attr('disabled', false);
            }, 1500);

        });
    });

    restore();

});