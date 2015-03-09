var timer;
var hour;
var minutes;
var seconds;
var countDown;

function startCountdown(seconds, status, direction) {
    if (status)
        $("#sample_countdown").show();
    else {
        $("#sample_countdown").hide();
    }
    var block = document.getElementById('sample_countdown');
    console.log("startCountdown");
    simpleTimer(seconds, block, status, direction);
}

function startTimer(status, direction) {
    clearTimeout(countDown);
    if (status)
        $("#sample_timer").show();
    else {
        $("#sample_timer").hide();
    }
    $("#sample_countdown").hide();
    var block = document.getElementById('sample_timer');
    simpleTimer(0, block, status, direction);
}

function getTime() {
    return hour + ':' + minutes + ':' + seconds;
}

function simpleTimer(sec, block, status, direction) {
    if (status) {
        var time = sec;
        direction = direction || false;

        hour = parseInt(time / 3600);
        if (hour < 1) hour = 0;
        time = parseInt(time - hour * 3600);
        if (hour < 10) hour = '0' + hour;

        minutes = parseInt(time / 60);
        if (minutes < 1) minutes = 0;
        time = parseInt(time - minutes * 60);
        if (minutes < 10) minutes = '0' + minutes;

        seconds = time;
        if (seconds < 10) seconds = '0' + seconds;

        block.innerHTML = hour + ':' + minutes + ':' + seconds;

        if (direction) {
            sec++;
            timer = setTimeout(function () { simpleTimer(sec, block, status, direction); }, 1000);
        } else {
            sec--;

            if (sec > 0) {
                countDown = setTimeout(function () { simpleTimer(sec, block, status, direction); }, 1000);
            } else {
                TimeIsUp();
            }
        }
    } else {
        clearTimeout(timer);
        clearTimeout(countDown);
        block.innerHTML = "00:00:00";
    }
}

function TimeIsUp() {
    $("#info").empty();
    $("#mistakes").show();
    $("#ready").hide();
    $("#sample_countdown").hide();
    $("#tryAgain").show();
    $("#info").append("Oops, time is up! Please try again. <br /><img width='128px' style='margin-top:10px;' src='images/sadness.png'><br />");
}