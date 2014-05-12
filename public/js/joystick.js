require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
	    jquery: "/js/lib/jquery",
        underscore: "/js/lib/underscore",
        backbone: "/js/lib/backbone",
        Connector: "/js/lib/Connector",
        FnQuery: "/js/lib/FnQuery",
        Modernizr: "lib/modernizr",
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
        'Modernizr': {
            exports: 'Modernizr'
        }
    }
});

define([
    'Connector',
    'checkTechs'
], function(
    Connector,
    checkTechs
){

	if (checkTechs.checkJoystick()) {
        //console.log("modern");
        $("#features-notsupported").hide();
        $("#features-supported").show();
    } else {
        //console.log("old");
        $("#features-supported").hide();
        $("#features-notsupported").show();
    }

	var $page_preloader = $('#page-preloader'),
        $preloader = $page_preloader.find('.preloader');
    $preloader.delay(1000).fadeOut('slow');
    $page_preloader.delay(1000).fadeOut('slow');
    
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
    	var gamma = Math.round(event.gamma/10)*10;
    	var beta = Math.round(event.beta/10)*10;
    	var turn = "rotateX(" + gamma +"deg)" + " rotateY(" + beta +"deg)";
    	$("#left-btn-img").css("transform", turn);
    	$("#left-btn-img").css("-webkit-transform", turn);
    	$("#right-btn-img").css("transform", turn);
    	$("#right-btn-img").css("-webkit-transform", turn);
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
			sendMsg('play');
		}
		else {
			$(this).attr("src", "/js/images/play.png");
			sendMsg('pause');
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
		sendMsg('restart');
	});

	/*button left and right*/
	$("#left-btn").on("touchstart", function(e) {
		e.preventDefault();
		$("#left-btn-img").css("opacity", "0.5");
	});
	$("#left-btn").on("touchmove", function(e) {
		e.preventDefault();
		
		$("#left-btn-img").css("opacity", "1");
	});
	$("#left-btn").on("touchend", function(e) {
		e.preventDefault();
		$("#left-btn-img").css("opacity", "1");
		sendMsg('left');
	});
	// Hammer($("#left-btn")).on("hold", function(event) {
	// 	event.preventDefault();
	// });


	$("#right-btn").on("touchstart", function(e) {
		e.preventDefault();
		$("#right-btn-img").css("opacity", "0.5");
	});
	$("#right-btn").on("touchmove", function(e) {
		e.preventDefault();
		$("#right-btn-img").css("opacity", "1");
	});
	$("#right-btn").on("touchend", function(e) {
		e.preventDefault();
		$("#right-btn-img").css("opacity", "1");
		sendMsg('right');
	});
	// Hammer($("#right-btn")).on("hold", function(event) {
	// 	event.preventDefault();
	// });
	
	sendMsg = function(msg){
		server.send(msg, function(answer){
			//console.log(answer);
		});
	};
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
		$("#features-supported").show();
        $("#con-error").hide();
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

	var disconnect = function(){
        $("#features-notsupported").hide();
        $("#features-supported").hide();
        $("#con-error").show();
    };

	// Старт игры
	start = function(guid){
		//console.log('start player');
		// Сохраняем id связки
		sessionStorage.setItem('playerguid', guid);
		$("#connection").hide();
		$("#joystick").show();
		//message.innerHTML = 'game';
	};

	server.on('reconnect', reconnect);
	server.on('disconnect', disconnect);
	
	init();

	// Обмен сообщениями
	server.on('message', function(data, answer){
		switch (data) {
            case 'gameover': 
            	$("#play-btn").attr("src", "/js/images/play.png");
            	answer(data); break;
            default: answer(data);
        }
	});

	window.server = server;

	
	/*
	server.send('message', function(answer){
		console.log(answer);
	});
	*/
});
