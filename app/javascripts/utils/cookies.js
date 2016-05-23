'use strict';

const doc = window.document;
module.exports = {
    create: (name, value, options) => {
        if (!options)
            options = {};

        let cookie = `${name}=${value}; path=${(options.path || '/')}`;
        const domain = options.domain;
        const expiresIn = options.expiresIn;

        if (domain)
            cookie += `; domain=.${domain}`;

        if (typeof expiresIn === 'number') {
            // expiresIn is in ms
            const date = new Date(new Date().getTime() + expiresIn);
            cookie += `; expires=${date.toGMTString()}`;
        }

        doc.cookie = cookie;
    },

    read: name => {
        const nameEQ = `${name}=`;
        const cookies = doc.cookie.split(';');
        let cookie;

        for (let i = 0; i < cookies.length; i++) {
            cookie = cookies[i].replace(/^\s+/, '');

            if (cookie.indexOf(nameEQ) === 0)
                return cookie.substring(nameEQ.length);
        }

        return null;
    },
};
