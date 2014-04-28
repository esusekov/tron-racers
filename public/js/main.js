require.config({
    urlArgs: "_=" + (new Date()).getTime(),
    baseUrl: "js",
    paths: {
        jquery: "lib/jquery",
        underscore: "lib/underscore",
        backbone: "lib/backbone",
        Connector: "lib/Connector",
        FnQuery: "lib/FnQuery",
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
        }
    }
});

define([
    'router',
    'Connector'
], function(
    router,
    Connector
){
    Backbone.history.start();
    localStorage.setItem("savedData", JSON.stringify([]));
    
    $(function() {
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
            } else { // иначе
                // переподключаемся к уже созданной связке
                reconnect();
            }
        };

        // Переподключение
        var reconnect = function(){
            // Используем сохранненный id связки
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

        server.on('reconnect', reconnect);

        // Старт игры
        var start = function(guid){
            console.log('start console');
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

        /*
        server.send('message', function(answer){
            console.log(answer);
        });
        */
    });
});
