define(['Modernizr'],
    function(Modernizr) {

        var checkApp = function() {
            if (!Modernizr.fontface || !Modernizr.canvas || !Modernizr.localstorage || !Modernizr.sessionstorage || !Modernizr.websockets) {
                return false;
            }
            return true;
        };

        var checkJoystick = function() {
            if (!Modernizr.fontface || !Modernizr.sessionstorage || !Modernizr.websockets || !Modernizr.touch) {
                return false;
            }
            return true;
        };

        return {
            checkApp: checkApp,
            checkJoystick: checkJoystick
        }
    });