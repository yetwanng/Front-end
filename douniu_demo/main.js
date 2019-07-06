//定义玩家属性及玩家数
var playerlist = [];

var playerNum = 5;
var player ={
    order: 0,
    cards: [{value: '',type: ''}],
    NIU: 0,
    muti:1,
    facecardsCount:0,
    dealer:false,
    money:0
};
var playtimes =1;

//生成设定数量的玩家
function  createplayers (playerNum) {
    for (var i= 0;i<playerNum; i++ ) {
        playerlist.push(player);
        playerlist[i].order = i;
    }
}


//生成扑克牌
function generatePoker () {
    //定义牌面的数字和花色
    var PokerValues =['A','1','2','3','4','5','6','7','8','9','10','J','Q','K'];
    var PokerTypes =['spades','heart','diamond','clubs'];
    var allCards = [];
    //用花色和数字组合生成全部扑克牌（除大小王）
    for (var i = 0, len1 = PokerTypes.length; i < len1; i++) {
        for (var j = 0, len2 = PokerValues.length; j < len2; j++) {
            var cardCurrentValue = {
                type:PokerTypes[i],
                value:PokerValues[j]
            };
            allCards.push(cardCurrentValue);
        }
    }
    return allCards;
}

//随机洗牌
function shuffle(arr) {
    if (!arr) {
        throw '错误，请传入正确数组';
    }

    var newArr = arr.slice(0);
    for (var i = newArr.length - 1; i >= 0; i--) {
        // 随机范围[0,1)
        var randomIndex = Math.floor(Math.random() * (i + 1));
        var itemAtIndex = newArr[randomIndex];
        newArr[randomIndex] = newArr[i];
        newArr[i] = itemAtIndex;
    }

    return newArr;
}



//发牌函数
function dealPoker() {
    //生成扑克牌
    var allCards = generatePoker();
    //洗牌,不改变洗完牌后的整个数组
    var randomCards = shuffle(allCards);
    //依次发牌

    for (var i = 0; i<playerNum; i++) {
        for (var j = 0; j < 5; j++) {
            playerlist[i].cards[j] = randomCards[j+i*playerNum];
        }
    }

}

//判断函数（转换成“牛”分数,判断花牌数量等）
function value2score (player) {
    //发牌
    dealPoker();
    var niuScores= [];
    for (var i=0; i<5;i++) {
        switch (player.cards[i].value) {
            case 'J':{niuScores.push(10);player.facecardsCount++}
                break;
            case 'Q':{niuScores.push(10);player.facecardsCount++}
                break;
            case 'K':{niuScores.push(10);player.facecardsCount++}
                break;
            case 'A':niuScores.push(1);
                break;
            default: niuScores.push(0+player.cards[i].value);
                break;
        }

    }
    return niuScores;
}


//计算“牛”的函数
function calculateNIU (player) {
    var partA=0;
    var scoreArray=value2score(player);
    var sumOfScore=scoreArray.reduce(function(x,y){return x+y},0);
    for (var i=0;i<5;i++) {
        for (var j=i+1;j<5;j++) {
            for (var k=j+1;k<5;k++) {
                partA = scoreArray[i]+scoreArray[j]+scoreArray[k];
                if (partA%10===0) {player.NIU=(sumOfScore-partA)%10;break;}

            }
        }
    }
    if (player.NIU>0) {return player.NIU;}
    if (player.NIU===0) {return 10;}

}

//结算函数（对比各玩家的牛数，然后结算money）
function balance (player) {
    //判断赔率
    switch(player.NIU) {
        case 0:player.muti=1;
            break;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6: player.muti=1;
            break;
        case 7:
        case 8:
        case 9: player.muti=2;
            break;
        case 10: {
            if (player.facecardsCount===5) {player.muti=4;}
            else {player.muti=3}
        }
    }

}
//比较结算money
function paymoney (player) {
    //NIU数不同则直接判断结算
    if (player.NIU < playerlist[0].NIU) {playerlist[1] += playerlist[1].muti;player.money -= playerlist[1].muti;}
    else if (player.NIU > playerlist[0].NIU) {player.money += player.muti; playerlist[1].money -= player.muti}
    else {
        //NIU数大小相同时调用判断整体牌面大小的函数
        if (compare(playerlist[1],player)) {playerlist[1]+= playerlist[1].muti; player.money-=playerlist[1].muti;}
        else {player.money+=player.muti; playerlist[1].money -= player.muti}
    }
}

//NIU数相同时的判断函数
function compare(banker,player) {

    //将玩家的牌按照牌面值大小进行排序
    var bankerCurrentCards = banker.cards.sort(function (a, b) { return a.value.charCodeAt(0)-b.value.charCodeAt(0);});
    var playerCurrentCards= player.cards.sort(function (a, b) { return a.value.charCodeAt(0)-b.value.charCodeAt(0);});
    for (var i= 0; i<5; i++) {
        if (bankerCurrentCards[i].value==='A') {bankerCurrentCards.splice(i,i);bankerCurrentCards.splice(0, 0, bankerCurrentCards[i]);}
        if (playerCurrentCards[i].value==='A') {playerCurrentCards.splice(i,i);playerCurrentCards.splice(0, 0, playerCurrentCards[i]);}
    }
    //将排好序的数组转化为字符串方便后面比较大小
    var cardsvaluesA = [];
    var cardsvaluesB = [];
    for (i=0; i<5; i++) {
        cardsvaluesA.push(bankerCurrentCards[i]);
        cardsvaluesB.push(playerCurrentCards[i]);
    }
    //比较牌面大小
    if (cardsvaluesA.join("")> cardsvaluesB.join("")) return true;
    if (cardsvaluesA.join("")< cardsvaluesB.join("")) return false;
    //当牌面大小一致时，比较花色
    if (cardsvaluesA.join()=== cardsvaluesB.join()) {
        var typeValues ={'spades':4,'heart':3,'diamond':2,'clubs':1};
        var typeToValue = function (x) {return typeValues[x.type];};
        var typeValueOfBanker = [];
        var typeValueOfPlayer = [];
        for (i=0; i<5; i++) {typeValueOfBanker.push(typeToValue(bankerCurrentCards[1]));}
        for (i=0; i<5; i++) {typeValueOfPlayer.push(typeToValue(playerCurrentCards[i]));}
        if (typeValueOfBanker.join("") >= typeValueOfPlayer.join("")) return true;
        else return false;
    }

}

//demo主程序函数
function douniudemo() {

    //创建玩家
    createplayers(playerNum);

    //结算money
    for (var i= 1;i<playerNum;i++) {
        calculateNIU(playerlist[i]);
        balance(playerlist[i]);
        paymoney(playerlist[i]);
    }

}

douniudemo(playtimes);

alert(playerlist[0].cards.value);

