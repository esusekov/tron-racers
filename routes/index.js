
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { 
		title: 'Tron Racers',
		development: ('production' != process.env.NODE_ENV)
	});
};

/*
 * GET joystick page.
 */

exports.joystick = function(req, res){
	res.render('joystick', {
		title: 'TR Joystick',
		development: ('production' != process.env.NODE_ENV)
	});
};

