var startSecondsDefault = 10;
var seconds = startSecondsDefault;
var selectedCards = [];
var amount = 3;
var maxAmount = 54;
var gameState = 0;

$(document).ready(function () {
    
    var table = $("#table");

    Initialization();
    
    $("#CardSize").val("3");

    BeforeGame(selectedCards, cards, table, amount);

    $("#ready").bind("click", function () {

        if (gameState === 0) {
            StartGame(selectedCards, cards, table, amount);
            $(this).text("I'm ready!");
            gameState++;
            startCountdown(seconds, true, false);
        }
        else if (gameState === 1) {
            //Clear table
            table.empty();

            //Shuffle selected cards
            var shuffledCards = selectedCards.slice(0);
            shuffledCards = shuffle(shuffledCards);

            //Draw shuffled cards
            DrawCards(table, shuffledCards, amount);

            var mistakes = 0;

            CardClick(mistakes);

            $("#mistakes").show();
            $("#info").empty();
            $("#info").append("Mistakes: " + mistakes);
            $("#ready").hide();
            startTimer(true, true);
        }
    });

    $("#TheNumberOfCards").bind("change", (function () {
        amount = this.value;
        restartGame();
    }));

    $("#DifficultyLevel").bind("change", (function () {
        restartGame();
    }));

    $("#CardSize").bind("change", (function () {
        SetCardsSize();
    }));

    $("#restart").bind("click", function () {
        restartGame();
    });

    $("#tryAgain").bind("click", function () {
        restartGame();
    });

    $("#nextStage").bind("click", function () {
        amount++;

        $("#TheNumberOfCards").val(amount);
        restartGame();
    });
});

function GetCardSize() {
    return $("#CardSize").val() * 50 + 20 + 'px';
}

function SetCardsSize() {
    var size = GetCardSize();
    $(".card").css('width', size);
}

function CardClick(mistakes) {
    var index = 0;
    $(".card").bind("click", function (event) {
        if (index !== selectedCards.length) {
            if (event.target.id === selectedCards[index]) {
                $(this).addClass("cardSelected");
                index++;
            } else {
                if (!$(this).hasClass("cardSelected")) {
                    mistakes++;
                    $("#info").empty();
                    $("#info").append("Mistakes: " + mistakes);
                }
            }
        }
        if (index === selectedCards.length) {
            var result = "";
            if (mistakes === 0)
                result = Win(amount, mistakes);
            else
                result = Loose(amount, mistakes);

            $("#tryAgain").show();
            $("#nextStage").show();
            $("#info").empty();
            $("#info").append(result);

            startTimer(false, true);
        }
    });
}

function Initialization() {
   

    for (var i = amount; i <= maxAmount; i++)
        $("#TheNumberOfCards").append($("<option/>", {
            value: i,
            text: i
        }));

    var difficulty = ["Low", "Medium", "Hard", "Insane"];
    for (i = 0; i < difficulty.length; i++)
        $("#DifficultyLevel").append($("<option/>", {
            value: difficulty.length - i,
            text: difficulty[i]
        }));

    var size = ["Tiny", "Small", "Medium", "Large", "Huge"];
    for (i = 0; i < size.length; i++)
        $("#CardSize").append($("<option/>", {
            value: i+1,
            text: size[i]
        }));
}

function restartGame() {
    BeforeGame(selectedCards, cards, $("#table"), amount);
    gameState = 0;
    seconds = startSecondsDefault;
    $("#ready").text("Start");
    $("#ready").show();
    $("#mistakes").hide();
    $("#nextStage").hide();
    $("#tryAgain").hide();
    startTimer(false);
    
}

function Info(amount, mistakes) {
    return "The number of cards: " + amount + "<br />Time: " + getTime() + "<br />Mistakes: " + mistakes;
}

function Win(amount, mistakes) {
    return "Congratulations!<br /><img src='images/thumpUp.png' style='margin:1.1em;'><br />" + Info(amount, mistakes);
}

function Loose(amount, mistakes) {
    return "You can do better!<br /><img src='images/thumpDown.png' style='margin:1.1em;'><br />" + Info(amount, mistakes);
}

function BeforeGame(selectedCards, cards, table, amount) {
    selectedCards.length = 0;
    while (selectedCards.length < amount) {
        selectedCards.push("backside.png");
    }
    //Draw cards
    DrawCards(table, selectedCards, amount);
}

function StartGame(selectedCards, cards, table, amount) {
    selectedCards.length = 0;
    var difLvl = $("#DifficultyLevel");
    seconds = difLvl.val() * 5;
    seconds += ($("#TheNumberOfCards").val() - 2) * difLvl.val() * 2;
    //Select several cards
    while (selectedCards.length < amount) {
        var random = Math.floor((Math.random() * cards.length) + 0);
        var c = cards[random];
        if (selectedCards.indexOf(c) === -1)
            selectedCards.push(c);
    }
    //Draw shuffled cards
    DrawCards(table, selectedCards, amount);
}

function shuffle(o) {
    var result = o.slice(0);

    for (var i = result.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * i); // no +1 here!
        var temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }

    return result;
};

function DrawCards(table, cards, amount) {
    table.empty();
    //Draw cards in Div
    var size = GetCardSize();
    //SetCardsSize();
    for (var i = 0; i < amount; i++) {
        table.append("<img id='" + cards[i] + "' class='card' style='width:" + size + ";' src='images/cards/" + cards[i] + "'/>");
    }
   
}

