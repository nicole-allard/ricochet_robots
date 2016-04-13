'use strict';

var doc = window.document;
module.exports = {
    create: function (name, value, options) {
        if (!options)
            options = {};

        var cookie = name + '=' + value + '; path=' + (options.path || '/');
        var domain = options.domain;
        var expiresIn = options.expiresIn;

        if (domain)
            cookie += '; domain=.' + domain;

        if (typeof(expiresIn) === 'number') {
            // expiresIn is in ms
            var date = new Date(new Date().getTime() + expiresIn);
            cookie += '; expires=' + date.toGMTString();
        }

        doc.cookie = cookie;
    },

    read: function (name) {
        var nameEQ = name + '=';
        var cookies = doc.cookie.split(';');
        var cookie;

        for (var i = 0; i < cookies.length; i++) {
            cookie = cookies[i].replace(/^\s+/, '');

            if (cookie.indexOf(nameEQ) === 0)
                return cookie.substring(nameEQ.length);
        }

        return null;
    }
};
