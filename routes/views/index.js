var keystone = require('keystone');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res),
		locals = res.locals;

	// get published posts and paginate them
	view.on('init', function(next) {
		keystone.list('Post').paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where({ state: 'published' })
			.sort('-publishedDate')
			.populate('author categories')
			.exec(function(err, results) {
				console.log(results);
				locals.results = results;
				next(err);
			});
	});

	// Render the view
	view.render('views/index');

};
