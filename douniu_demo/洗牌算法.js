// 洗牌算法，传入一个数组，随机乱序排列,不污染原数组
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

// 生成一副扑克牌
function generatePoker() {
    // 第一步:定义四个花色，这里就用中文了
    var cardType = ['黑桃', '红桃', '梅花', '方块'];

    // 第二步:定义13张普通牌
    var cardValue = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    // 第三步:定义2张特殊牌，大王与小王
    var specialCard = ['大王', '小王'];

    // 第四步:根据上述数组生成54张牌
    var allCards = [];
    for (var i = 0,
             len1 = cardType.length; i < len1; i++) {
        for (var j = 0,
                 len2 = cardValue.length; j < len2; j++) {
            allCards.push(cardType[i] + cardValue[j]);
        }
    }
    allCards = allCards.concat(specialCard);

    return allCards;
}

// 随机发N张扑克牌
function dealPoker(num) {
    if(!num || num>54 || typeof(num)!== 'number') {
        throw '错误，传入的数字非法，只能是[1-54]';
    }
    // 生成扑克牌
    var allCards = generatePoker();

    // 洗牌-不污染原先的数组
    var randomCards = shuffle(allCards);

    return randomCards.slice(0, num);
}

// 测试用例
console.log(dealPoker(3));
console.log(dealPoker(4));
console.log(dealPoker(10));

// 生成一副洗好的全新乱序牌
var poker = dealPoker(54);
// 接下来如果想要发牌，依次将数组pop即可，因为它本身已经被打乱了，可以一直发完54张