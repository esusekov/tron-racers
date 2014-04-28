require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
	    jquery: "/js/lib/jquery",
        underscore: "/js/lib/underscore",
        backbone: "/js/lib/backbone",
        Connector: "/js/lib/Connector",
        FnQuery: "/js/lib/FnQuery",
        hammer: "/js/lib/hammer",
        "socket.io": "/socket.io/socket.io"
    },
    shim: {
	    'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        "socket.io": {
            exports: "io"
        },
        "hammer": {
            exports: "Hammer"
        }
    }
});

define([
    'Connector',
    'hammer'
], function(
    Connector,
    Hammer
){
	//var message = document.getElementById('message');
	var input = document.getElementById('token');
	var start, init, reconnect;

	// Создаем связь с сервером
	var server = new Connector({
			server: ['bind'],
			remote: '/player'
		}
	);

	window.addEventListener("touchmove", function(e) {
		e.preventDefault();
	});

	window.addEventListener('deviceorientation', function(event) {
    	console.log(event.gamma);
    	var turn = "rotateX(" + event.gamma +"deg)";
    	$("#left-btn").css("transform", turn);
    	$("#left-btn").css("-webkit-transform", turn);
    	$("#right-btn").css("transform", turn);
    	$("#right-btn").css("-webkit-transform", turn);
	});

	$("#play-btn").on("touchstart", function(e) {
		e.preventDefault();
		$(this).css("opacity", "0.5");
	});
	$("#play-btn").on("touchmove", function(e) {
		e.preventDefault();
		
		$(this).css("opacity", "1");
	});
	$("#play-btn").on("touchend", function(e) {
		e.preventDefault();
		if ($(this).attr("src") == "/js/images/play.png") {
			$(this).attr("src", "/js/images/pause.png");
			server.send('play', function(answer){
				console.log(answer);
			});
		}
		else {
			$(this).attr("src", "/js/images/play.png");
			server.send('pause', function(answer){
				console.log(answer);
			});
		}
		$(this).css("opacity", "1");
	});

	/*restart*/
	$("#restart-btn").on("touchstart", function(e) {
		e.preventDefault();
		$(this).css("opacity", "0.5");
	});
	$("#restart-btn").on("touchmove", function(e) {
		e.preventDefault();
		
		$(this).css("opacity", "1");
	});
	$("#restart-btn").on("touchend", function(e) {
		e.preventDefault();
		$(this).css("opacity", "1");
		server.send('restart', function(answer){
			console.log(answer);
		});
	});

	/*button left and right*/
	$("#left-btn").on("touchstart", function(e) {
		e.preventDefault();
		$(this).css("opacity", "0.5");
	});
	$("#left-btn").on("touchmove", function(e) {
		e.preventDefault();
		
		$(this).css("opacity", "1");
	});
	$("#left-btn").on("touchend", function(e) {
		e.preventDefault();
		$(this).css("opacity", "1");
		server.send('left', function(answer){
			console.log(answer);
		});
	});
	// Hammer($("#left-btn")).on("hold", function(event) {
	// 	event.preventDefault();
	// });


	$("#right-btn").on("touchstart", function(e) {
		e.preventDefault();
		$(this).css("opacity", "0.5");
	});
	$("#right-btn").on("touchmove", function(e) {
		e.preventDefault();
		$(this).css("opacity", "1");
	});
	$("#right-btn").on("touchend", function(e) {
		e.preventDefault();
		$(this).css("opacity", "1");
		server.send('right', function(answer){
			console.log(answer);
		});
	});
	// Hammer($("#right-btn")).on("hold", function(event) {
	// 	event.preventDefault();
	// });

	// Инициализация
	init = function(){
		//message.innerHTML = 'ready';
		// Если id нет
		if (!sessionStorage.getItem('playerguid')){
			// Ждем ввода токена
			input.parentNode.addEventListener('submit', function(e){
				e.preventDefault();

				// И отправляем его на сервер
				server.bind({token: input.value}, function(data){
					if (data.status == 'success'){ //  В случае успеха
						// Стартуем джостик
						start(data.guid);
					}
				});
			}, false);

		} else { // иначе
			// переподключаемся к уже созданной связке
			reconnect();
		}
	};

	// Переподключение
	// Используем сохранненный id связки
	reconnect = function(){
		server.bind({guid: sessionStorage.getItem('playerguid')}, function(data){
			// Если все ок
			if (data.status == 'success'){
				// Стартуем
				start(data.guid);
			// Если связки уже нет
			} else if (data.status == 'undefined guid'){
				// Начинаем все заново
				sessionStorage.removeItem('playerguid');
				init();
			}
		});
	};

	// Старт игры
	start = function(guid){
		console.log('start player');
		// Сохраняем id связки
		sessionStorage.setItem('playerguid', guid);
		$("#connection").hide();
		$("#joystick").show();
		//message.innerHTML = 'game';
	};

	server.on('reconnect', reconnect);

	init();

	// Обмен сообщениями
	server.on('message', function(data, answer){
		console.log('message', data);
		answer('answer');
	});

	window.server = server;

	
	/*
	server.send('message', function(answer){
		console.log(answer);
	});
	*/
});
