var startSecondsDefault = 10;
var seconds = startSecondsDefault;
var selectedCards = [];
var amount = 3;
var maxAmount = 54;
var gameState = 0;

$(document).ready(function () {
    var table = $("#table");
    Initialization();

    //Set default size of cards (medium)
    $("#CardSize").val("3");

    BeforeGame(selectedCards, cards, table, amount);

    $("#ready").bind("click", function () {
        var gameType = $("#GameType").val();
        if (gameState === 0) {
            StartGame(selectedCards, cards, table, amount);
            $(this).text("I'm ready!");
            gameState++;
            startCountdown(seconds, true, false);
        } else if (gameState === 1) {
            switch (gameType) {
                case "1":
                    Game_CorrectSequence(table);
                    break
                case "2":
                    Game_ExtraCards(table);
                    break
            }
        }
    });

    var numberOfCards = $("#TheNumberOfCards");

    $("#GameType").bind("change", (function () {
        amount = numberOfCards.val();
        restartGame();
    }));

    numberOfCards.bind("change", (function () {
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

        numberOfCards.val(amount);
        restartGame();
    });
});

function restartGame() {
    BeforeGame(selectedCards, cards, $("#table"), amount);
    gameState = 0;
    seconds = startSecondsDefault;
    $("#ready").text("start");
    $("#ready").show();
    $("#mistakes").hide();
    $("#nextStage").hide();
    $("#tryAgain").hide();
    startTimer(false);
}

function BeforeGame(selectedCards, cards, table, amount) {
    selectedCards.length = 0;
    while (selectedCards.length < amount) {
        selectedCards.push("backside.png");
    }
    //Draw cards
    DrawCards(table, selectedCards);
}

function Game_CorrectSequence(table) {
    //Clear table
    table.empty();
    //Shuffle selected cards
    var shuffledCards = selectedCards.slice(0);
    shuffledCards = shuffle(shuffledCards);
    //Draw shuffled cards
    DrawCards(table, shuffledCards);
    var mistakes = 0;
    CardClick(mistakes);
    $("#mistakes").show();
    $("#info").empty();
    $("#info").append("Mistakes: " + mistakes);
    $("#ready").hide();
    startTimer(true, true);
}

function Game_ExtraCards(table) {
    //Clear table
    table.empty();
    var shuffledCards = selectedCards.slice(0);
    while (shuffledCards.length === selectedCards.length) {
        var card = GetRandomCard();
        AddCardIfNotExists(shuffledCards, card);
    }
    shuffledCards = shuffle(shuffledCards);
    //Draw shuffled cards
    DrawCards(table, shuffledCards);
    var mistakes = 0;
    ExtraCardClick(mistakes);

    $("#mistakes").show();
    $("#info").empty();
    $("#info").append("Mistakes: " + mistakes);
    $("#ready").hide();
    startTimer(true, true);
}

function GetCardSize() {
    return $("#CardSize").val() * 50 + 20 + 'px';
}

function SetCardsSize() {
    var size = GetCardSize();
    $(".card").css('width', size);
}

function ExtraCardClick(mistakes) {
    var index = 0;
    $(".card").bind("click", function (event) {
        var result = "";
        if (selectedCards.indexOf(event.target.id) === -1) {
            $(this).addClass("cardSelected");
            result = Win(amount, 0);
        } else {
            result = Loose(amount, 0);
        }
        $("#tryAgain").show();
        $("#nextStage").show();
        $("#info").empty();
        $("#info").append(result);

        startTimer(false, true);
    });
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
            value: i + 1,
            text: size[i]
        }));
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

function StartGame(selectedCards, cards, table, amount) {
    selectedCards.length = 0;
    var difLvl = $("#DifficultyLevel");
    seconds = difLvl.val() * 5;
    seconds += ($("#TheNumberOfCards").val() - 2) * difLvl.val() * 2;

    //Select several cards
    while (selectedCards.length < amount) {
        var c = GetRandomCard();
        AddCardIfNotExists(selectedCards, c);
    }

    //Draw shuffled cards
    DrawCards(table, selectedCards);
}

function GetRandomCard() {
    var random = Math.floor((Math.random() * cards.length) + 0);
    return cards[random];
}

function AddCardIfNotExists(cards, card) {
    if (cards.indexOf(card) === -1)
        cards.push(card);
}

function shuffle(o) {
    var result = o.slice(0);

    for (var i = result.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * i);
        var temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }

    return result;
};

function DrawCards(table, cards) {
    table.empty();
    //Draw cards in Div
    var size = GetCardSize();
    //SetCardsSize();
    for (var i = 0; i < cards.length; i++) {
        table.append("<img id='" + cards[i] + "' class='card' style='width:" + size + ";' src='images/cards/" + cards[i] + "'/>");
    }
}

