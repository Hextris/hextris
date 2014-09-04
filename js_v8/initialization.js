$(document).ready(function() {
    initialize();
    $('#bottombar').hide();
});

function showbottombar() {
    var isOffline = 'onLine' in navigator && !navigator.onLine;
    if (isOffline) {
        setTimeout(showbottombar, 1000);
    } else {
        window.iframeHasLoaded = true;
        if (gameState != 1) {
            $('#bottombar').fadeIn(150, 'linear');
        }
    }
}

function hidebottombar() {
    $('#bottombar').fadeOut(150, 'linear');
}

function initialize(a) {
    window.rush = 1;
    window.lastTime = Date.now();
    window.iframHasLoaded = false;
    window.colors = ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71"];
    window.hexColorsToTintedColors = {
        "#e74c3c": "rgb(241,163,155)",
        "#f1c40f": "rgb(246,223,133)",
        "#3498db": "rgb(151,201,235)",
        "#2ecc71": "rgb(150,227,183)"
    };

    window.rgbToHex = {
        "rgb(231,76,60)": "#e74c3c",
        "rgb(241,196,15)": "#f1c40f",
        "rgb(52,152,219)": "#3498db",
        "rgb(46,204,113)": "#2ecc71"
    };

    window.rgbColorsToTintedColors = {
        "rgb(231,76,60)": "rgb(241,163,155)",
        "rgb(241,196,15)": "rgb(246,223,133)",
        "rgb(52,152,219)": "rgb(151,201,235)",
        "rgb(46,204,113)": "rgb(150,227,183)"
    };

    window.hexagonBackgroundColor = 'rgb(236, 240, 241)';
    window.hexagonBackgroundColorClear = 'rgba(236, 240, 241, 0.5)';
    window.centerBlue = 'rgb(44,62,80)';
    window.angularVelocityConst = 4;
    window.scoreOpacity = 0;
    window.textOpacity = 0;
    window.prevGameState = undefined;

    //render.js
    window.op = 0;
    window.saveState = localStorage.getItem("saveState") || "{}";
    if (saveState !== "{}") {
        op = 1;
    }

    //input.js
    //all of main.js

    //main.js
    window.textShown = false;

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / framerate);
        };
    })();

    $('#clickToExit').bind('click', toggleDevTools);
    window.settings;

    if (/Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        settings = {
            os: "other",
            platform: "mobile",
            startDist: 227,
            creationDt: 60,
            baseScale: 1.4,
            scale: 1,
            prevScale: 1,
            baseHexWidth: 87,
            hexWidth: 87,
            baseBlockHeight: 20,
            blockHeight: 20,
            rows: 7,
            speedModifier: 0.73,
            creationSpeedModifier: 0.73,
            comboTime: 240
        };
    } else {
        settings = {
            os: "other",
            platform: "nonmobile",
            baseScale: 1,
            startDist: 340,
            creationDt: 9,
            scale: 1,
            prevScale: 1,
            hexWidth: 65,
            baseHexWidth: 87,
            baseBlockHeight: 20,
            blockHeight: 15,
            rows: 8,
            speedModifier: 0.65,
            creationSpeedModifier: 0.65,
            comboTime: 240
        };

        $("#inst_main_body").html("The goal of Hextris is to stop blocks from leaving the inside of the outer gray hexagon<br><br>" + (settings.platform != 'mobile' ? 'Press the right and left arrow keys' : 'tap the left and right sides of the screen') + "  to rotate the Hexagon<br><br>Clear blocks and get points by making 3 or more blocks of the same color touch<br><br>Time left before your combo streak disappears is indicated shown by <span style='color:#f1c40f;'>the</span> <span style='color:#e74c3c'>colored</span> <span style='color:#3498db'>lines</span> <span style='color:#2ecc71'>in</span> the outer hexagon<br><br> " + (settings.platform == 'mobile' ? 'Toggle speeding up the game by tapping the inner hexagon' : "Speed up the game 2x by holding the down arrow"));
    }
    if(/Android/i.test(navigator.userAgent)) {
        settings.os = "android";
    }

    window.canvas = document.getElementById('canvas');
    window.ctx = canvas.getContext('2d');
    window.trueCanvas = {
        width: canvas.width,
        height: canvas.height
    };
    scaleCanvas();

    window.framerate = 60;
    window.history = {};
    window.score = 0;
    window.isGameOver = 3;
    window.scoreAdditionCoeff = 1;
    window.prevScore = 0;
    window.numHighScores = 3;

    highscores = [];
    if (localStorage.getItem('highscores')) {
        try {
            highscores = JSON.parse(localStorage.getItem('highscores'));
        } catch (e) {
            highscores = [];
        }
    }


    window.blocks = [];
    window.MainHex;

    window.gdx = 0;
    window.gdy = 0;

    window.devMode = 0;
    window.lastGen = undefined;
    window.prevTimeScored = undefined;
    window.nextGen = undefined;
    window.spawnLane = 0;
    window.importing = 0;
    window.importedHistory = undefined;
    window.startTime = undefined;

    window.gameState;
    setStartScreen();

    if (a != 1) {
        window.canRestart = 1;
        window.onblur = function(e) {
            if (gameState == 1) {
                pause();
            }
        };

        $('#startBtn').off();

        if (settings.platform == 'mobile') {
            $('#startBtn').on('touchstart', startBtnHandler);
        } else {
            $('#startBtn').on('mousedown', startBtnHandler);
        }

        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);
        $(window).resize(scaleCanvas);
        $(window).unload(function() {

            if (gameState == 1 || gameState == -1 || gameState === 0) localStorage.setItem("saveState", exportSaveState());
            else localStorage.setItem("saveState", "{}");
        });

        addKeyListeners();
        (function(i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function() {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-51272720-1', 'teamsnowman.github.io');
        ga('send', 'pageview');

        document.addEventListener("pause", handlePause, false);
        document.addEventListener("backbutton", handlePause, false);
        document.addEventListener("menubutton", handlePause, false); //menu button on android

        setTimeout(function() {
            if (settings.platform == "mobile") {
                try {
                    document.body.removeEventListener('touchstart', handleTapBefore, false);
                } catch (e) {

                }

                try {
                    document.body.removeEventListener('touchstart', handleTap, false);
                } catch (e) {

                }

                document.body.addEventListener('touchstart', handleTapBefore, false);
            } else {
                try {
                    document.body.removeEventListener('mousedown', handleClickBefore, false);
                } catch (e) {

                }

                try {
                    document.body.removeEventListener('mousedown', handleClick, false);
                } catch (e) {

                }

                document.body.addEventListener('mousedown', handleClickBefore, false);
            }
        }, 1);
    }
}

function startBtnHandler() {
    setTimeout(function() {
        if (settings.platform == "mobile") {
            try {
                document.body.removeEventListener('touchstart', handleTapBefore, false);
            } catch (e) {

            }

            try {
                document.body.removeEventListener('touchstart', handleTap, false);
            } catch (e) {

            }

            document.body.addEventListener('touchstart', handleTap, false);
        } else {
            try {
                document.body.removeEventListener('mousedown', handleClickBefore, false);
            } catch (e) {

            }

            try {
                document.body.removeEventListener('mousedown', handleClick, false);
            } catch (e) {

            }

            document.body.addEventListener('mousedown', handleClick, false);
        }
    }, 5);

    if (!canRestart) return false;

    if ($('#helpScreen').is(':visible')) {
        $('#helpScreen').fadeOut(150, "linear");
    }

    if (importing == 1) {
        init(1);
    } else {
        resumeGame();
    }
}

function handlePause() {
    if (gameState == 1 || gameState == 2) {
        pause();
    }
}

function handleTap(e) {
    handleClickTap(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
}

function handleClick(e) {
    handleClickTap(e.clientX, e.clientY);
}

function handleTapBefore(e) {
    var x = e.changedTouches[0].clientX;
    var y = e.changedTouches[0].clientY;

    if (x < 120 && y < 50 && $('.helpText').is(':visible')) {
        showHelp();
        return;
    }
}

function handleClickBefore(e) {
    var x = e.clientX;
    var y = e.clientY;

    if (x < 120 && y < 50 && $('.helpText').is(':visible')) {
        showHelp();
        return;
    }
}
