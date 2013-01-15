var onthisday = function () {
    "use strict";

    var highlightsUrl = 'http://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&page=Wikipedia:Selected_anniversaries/';
    var eventsUrl = 'http://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&section=1&page=';
    var birthsUrl = 'http://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&section=2&page=';
    var deathsUrl = 'http://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&section=3&page=';

    var getHighlights = function (date) { return getEntries(highlightsUrl, date); };
    var getEvents = function (date) { return getEntries(eventsUrl, date); };
    var getBirths = function (date) { return getEntries(birthsUrl, date); };
    var getDeaths = function (date) { return getEntries(deathsUrl, date); };

    var getEntries = function (url, date) {
        url = url + date;
        return $.get(url);
    };

    var getContent = function (title) {
        return $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
            data: {
                action: 'mobileview',
                page: title,
                sections: 'all',
                format: 'json'
            }
        });
    };

    var getImage = function (title) {
        return $.ajax({
            url: 'https://en.wikipedia.org/w/api.php',
            data: {
                action: 'query',
                titles: title,
                prop: 'imageinfo',
                generator: 'images',
                iiprop: 'url',
                format: 'json'
            }
        });
    };

    var extractEntries = function (text) {
        var items = [];
        var dom = $(text);
        $('li', dom).each(function (i, el) {
            var split = el.innerText.split(' – ', 2);
            if (split.length === 2) {
                var links = findLinks(el);
                items.push({
                    year: split[0],
                    description: split[1],
                    links: links
                });
            }
        });

        return items;
    };

    var findLinks = function (ctx) {
        var boldLink;
        var links = [];
        $('b a', ctx).each(function (i, el) {
            boldLink = {
                title: el.title,
                description: el.innerText
            };
            links.push(boldLink);
        });
        $('a', ctx).each(function (i, el) {
            var link = {
                title: el.title,
                description: el.innerText
            };
            links.push(link);
        });
        return links;
    };

    function formatDate(date) {
        var wrapper = moment(date);
        return wrapper.format('MMMM_D');
    }

    function incrementDate(date) {
        return moment(date).add('days', 1).toString();
    }

    function decrementDate(date) {
        return moment(date).subtract('days', 1).toString();
    }
    
    function format(text) {
        text = text.replace(/\/\//g, 'http://');
        text = text.replace(/\/wiki\//g, 'http://en.wikipedia.org/wiki/');
        return text;
    }

    return {
        getHighlights: getHighlights,
        getEvents: getEvents,
        getBirths: getBirths,
        getDeaths: getDeaths,
        extractEntries: extractEntries,
        getContent: getContent,
        formatDate: formatDate,
        incrementDate: incrementDate,
        decrementDate: decrementDate,
        getImage: getImage,
        format: format
    };
}();