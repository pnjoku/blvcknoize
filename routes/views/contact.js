var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function(req, res) {

	var newEnquiry = new Enquiry.model(req.body),
		updater = newEnquiry.getUpdateHandler(req);

	updater.process(req.body, { fields: 'name, email, phone, message' }, function(err) {
		if (err) {
			return res.json({ errors: err.errors });
		} else {
			return res.json(newEnquiry);
		}
	});

};
