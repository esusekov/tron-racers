var scores = [],
	id = 0;

function sortScores(){
	scores.sort(function(a,b){
		return b.score - a.score;
	});
}

module.exports = {
	getFull: function(req, res){
		var s;
		if (req.query.limit && !isNaN(parseInt(req.query.limit, 10))){
			s = [];
			for (var i = 0, l = scores.length, li = req.query.limit; i < l && i < li; i++){
				s.push(scores[i]);
			}
		} else {
			s = scores;
		}
		s = JSON.stringify(s);
		res.setHeader('Content-Type', 'application/javascript');
		res.setHeader('Content-Length', Buffer.byteLength(s));
		//тестирование ошибки клиента
		/*setTimeout(function () {
		res.writeHead(400, 'Bad Request');
		res.end();
		return;}, 2000);*/
		//тестирование ошибки сервера
		/*setTimeout(function () {
		res.writeHead(502, 'Bad Gateway');
		res.end();
		return;}, 2000);*/
		//убрать setTimeout
		setTimeout(function () {res.end(s)}, 2000);
	},

	getOne: function(req, res){
		var id = req.params.id,
			founded;
		
		if (!id || isNaN(parseInt(id, 10))){
			res.writeHead(400, 'Bad Request');
			res.end();
			return;
		}

		for (var i = 0, l = scores.length; i < l; i++){
			var score = scores[i];

			if (score.id == id){
				founded = score;
				break;
			}
		}

		if (founded){
			res.writeHead(200, 'OK');
			founded = JSON.stringify(founded);
			res.setHeader('Content-Type', 'application/javascript');
			res.setHeader('Content-Length', Buffer.byteLength(founded));
			res.end(founded);
		} else {
			res.writeHead(404, 'Not Found');
			res.end();
		}
	},

	post: function(req, res){
		var newScore = req.body;
		if (!newScore || !newScore.name || !newScore.score || newScore.score && isNaN(parseInt(newScore.score, 10))){
			res.writeHead(400, 'Bad Request');
			res.end();
			return;
		}
		newScore.id = id++;
		scores.push(newScore);
		sortScores();
		var s = JSON.stringify(newScore);
		res.setHeader('Content-Type', 'application/javascript');
		res.setHeader('Content-Length', Buffer.byteLength(s));
		//тестирование ошибки сервера
		/*setTimeout(function () {
		res.writeHead(502, 'Bad Gateway');
		res.end();
		return;}, 1000);*/
		//убрать setTimeout
		setTimeout(function () {res.end(s)}, 1000);
	},

	del: function(req, res){
		var id = req.params.id,
			founded;

		if (!id || isNaN(parseInt(id, 10))){
			res.writeHead(400, 'Bad Request');
			res.end();
			return;
		}

		for (var i = 0, l = scores.length; i < l; i++){
			var score = scores[i];

			if (score.id == id){
				scores.splice(i, 1);
				founded = true;
				break;
			}
		}

		sortScores();

		if (founded){
			res.writeHead(200, 'OK');
			res.end();
		} else {
			res.writeHead(404, 'Not Found');
			res.end();
		}
	},

	put: function(req, res){
		var id = req.params.id,
			score;

		if (!id || isNaN(parseInt(id, 10))){
			res.writeHead(400, 'Bad Request');
			res.end();
			return;
		}

		var newScore = req.body;

		if (!newScore || !newScore.name || !newScore.score || newScore.score && isNaN(parseInt(newScore.score, 10))){
			res.writeHead(400, 'Bad Request');
			res.end();
			return;
		}

		for (var i = 0, l = scores.length; i < l; i++){
			score = scores[i];

			if (score.id == id){
				scores.splice(i, 1, newScore);

				var s = JSON.stringify(score);
				res.setHeader('Content-Type', 'application/javascript');
				res.setHeader('Content-Length', Buffer.byteLength(s));
				res.end(s);
				return;
			}
		}

		res.writeHead(404, 'Not Found');
		res.end();
	}
};
