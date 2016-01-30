// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

var keystone = require('keystone'),
    nunjucks = require('nunjucks'),
    express = require('express'),
    app = express(),
    nunjucksConfig = new nunjucks.configure('templates', {
        autoescape: true,
        express: app
    });

keystone.app = app;

keystone.init({

	'name': 'blvcknoize',
	'brand': 'blvcknoize',

	'static': 'static',
    'view engine': 'html',
    'custom engine': nunjucksConfig.render,

	'emails': 'templates/emails',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'port': process.env.PORT
});

keystone.import('models');

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});

keystone.set('routes', require('./routes'));

keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

keystone.set('email rules', [{
	find: '/images/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/images/' : 'http://localhost:3000/images/'
}, {
	find: '/keystone/',
	replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/keystone/' : 'http://localhost:3000/keystone/'
}]);

keystone.set('email tests', require('./routes/emails'));

keystone.set('nav', {
	'posts': ['posts', 'post-categories'],
	'enquiries': 'enquiries',
	'users': 'users'
});

keystone.start();
