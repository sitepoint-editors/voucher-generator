const path = require('path');
const ghpages = require('gh-pages');

const PACKAGE = require('package.json');
const DIR_BUILD = path.join(__dirname, 'dist');

ghpages.publish(DIR_BUILD, {
    message: PACKAGE.version,
}, (err) => {
    throw new Error(err);
});
