require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        Connector: "lib/Connector",
        FnQuery: "lib/FnQuery",
        Modernizr: "lib/modernizr",
        "socket.io": "lib/socket.io"
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
    'router',
    'Connector',
    'checkTechs'
], function(
    router,
    Connector,
    checkTechs
){
    Backbone.history.start();
    localStorage.setItem("savedData", JSON.stringify([]));
    
    

    if (checkTechs.checkApp()) {
        //console.log("modern");
        $("#features-notsupported").hide();
        $("#features-supported").show();
    } else {
        //console.log("old");
        $("#features-supported").hide();
        $("#features-notsupported").show();
    }

    //Прелоадер
    var $page_preloader = $('#page-preloader'),
        $preloader = $page_preloader.find('.preloader');
    $preloader.delay(1000).fadeOut('slow');
    $page_preloader.delay(1000).fadeOut('slow');
    //gameMode = false - игра с клавиатуры, true - подключен джойстик
    var gameMode = false;

    var message = document.getElementById('message');
    var start, init, reconnect;
    // Создаем связь с сервером
    var server = new Connector({
            server: ['getToken', 'bind'],
            remote: '/console'
        }
    );

    // На подключении игрока стартуем игру
    server.on('player-joined', function(data){
        // Передаем id связки консоль-джостик
        start(data.guid);
        gameMode = true;
    });

    // Инициализация
    var init = function(){
        message.innerHTML = 'ready';
        // Если id нет
        if (!sessionStorage.getItem('consoleguid')){
            // Получаем токен
            server.getToken(function(token){
                message.innerHTML = token;
            });
            $("#info-connect").show();
        } else { // иначе
            // переподключаемся к уже созданной связке
            reconnect();
        }
    };

    // Переподключение
    var reconnect = function(){
        // Используем сохранненный id связки
        $("#con-error").hide();
        server.bind({guid: sessionStorage.getItem('consoleguid')}, function(data){
            // Если все ок
            if (data.status == 'success'){
                // Стартуем
                start(data.guid);
            // Если связки уже нет
            } else if (data.status == 'undefined guid'){
                // Начинаем все заново
                sessionStorage.removeItem('consoleguid');
                init();
            }
        });
    };

    var disconnect = function(){
        if (gameMode) {
            gameStop(0);
            window.location = "/#";
            $("#info-connect").hide();
            $("#start-game").hide();
            $("#con-error").show();
        }
    };

    server.on('reconnect', reconnect);
    server.on('disconnect', disconnect);
    // Старт игры
    var start = function(guid){
        //console.log('start console');
        // Сохраняем id связки
        sessionStorage.setItem('consoleguid', guid);
        $("#info-connect").hide();
        $("#start-game").show();
        window.location = "/#game";
    };

    init();

    // Обмен сообщениями
    server.on('message', function(data, answer){
        if ((window.location.href.indexOf("game") > -1) &&
            ($('#gameview').css("display") != "none")) {
            switch (data) {
                case 'play': gameStart(); answer(data); break;
                case 'pause': gameStop(0); answer(data); break;
                case 'restart': gameStop(-2); answer(data); break;
                default: coursesForTouch(data); answer(data);
            }
        }
    });

    window.server = server;

});
