// 先把之後會用的 HTML 元素取得存起來
var 
  hitBtn = document.getElementById('hit-btn');
  standBtn = document.getElementById('stand-btn'),
  resetBtn = document.getElementById('reset-btn'),
  dealerArea = document.getElementById('dealer-area'),
  playerArea = document.getElementById('player-area'),
  playerScoreElement = document.getElementById('player-score'),
  dealerScoreElement = document.getElementById('dealer-score'),
  gameOverToggle = document.getElementById('game-over'),
  result = document.getElementById('result');

// 用來存放52張牌；當 createNewCards function 被呼叫，會產生52個物件(代表52張牌)存到這個陣列裡。
var cards = [];



// 分別用來存放玩家與莊家拿到的牌
var playerCards = [];
var dealerCards = [];

// 更新 HTML 畫面：將 playerCards 與 dealerCards 當下的內容轉換成 HTML 圖片，更新到 HTML 上
var updateView = function() {
  // 取得目前遊戲狀態是否為 gameover，後面會倚賴這個變數來決定是否把莊家所蓋住的第一張蓋牌顯示出來
  var isGameOver = gameOverToggle.checked;


  // 將每一張牌 map 成 HTML
  var html = dealerCards.map(function(card, i) {
    // 使用 JavaScript 動態產生一個 img HTML 的元素
    var img = document.createElement('img');
    
    // 設定圖片網址
    img.src = (!isGameOver && i == 0) ? './images/back.svg' : card.image;
    
    // 將圖片元素轉成 HTML 字串回傳
    return img.outerHTML;
  });

  dealerArea.innerHTML = html.join('');

  if (isGameOver) {
    // 如果 gameover，顯示莊家的總點數
    dealerScoreElement.textContent = calculatePoints(dealerCards);
  } else {
    // 如果沒有 gameover，扣掉第一張牌的點數，計算總點數並顯示
    dealerScoreElement.textContent = '? + ' + calculatePoints(dealerCards.slice(1, dealerCards.length));
  }
  
  // 同 27 行註解
  html = playerCards.map(function(card) {
    var img = document.createElement('img');
    img.src = card.image;
    return img.outerHTML;
  });

  playerArea.innerHTML = html.join('');
  playerScoreElement.textContent = calculatePoints(playerCards);
};

// 重設52張牌
var createNewCards = function() {
  cards = [];
  var values = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
  var types = ['spades', 'diamonds', 'hearts', 'clubs'];

  values.forEach(function(card) {
    types.forEach(function(pattern) {
      // 13張牌 * 4種花色的組合，這一個區塊的代碼會執行 52 次，而且每一次 {card, pattern} 都會不一樣

      // 判斷目前的 card 是什麼，決定其點數為多少(這裡稍微複雜點，因為有兩個三元一次式)
      var value = ['ace', 'jack', 'queen', 'king'].includes(card) ? 
        (card == 'ace' ? 11 : 10) :
        Number(card);
        
      // 製作一張牌，這張牌有圖片網址(image)以及點數(value)
      var theCard = { 
        image: './images/' + card + '_of_' + pattern + '.svg',
        value: value
      };

      // write your code at here
      // 1. 請將牌 theCard 放進 cards 陣列裡
      cards.push(theCard);

    });
  })
};


// 重設遊戲
var initGame = function() {
  gameOverToggle.checked = false;

  playerCards = [];
  dealerCards = [];

  // write your code at here
  // 2. 呼叫 createNewCards function，以建立一副新的牌
  createNewCards();

  // 3. 呼叫 shuffle function 並代入整副牌，做一個洗牌的動作
  shuffle(cards);

  // 4. 從牌堆中取出牌，發給玩家跟莊家，莊家跟玩家要各拿到兩張牌
  //    提示：pop function 可以取出陣列的最後一個元素，再將取出的元素塞進玩家與莊家的牌堆
  playerCards.push(cards.pop());
  playerCards.push(cards.pop());

  dealerCards.push(cards.pop());
  dealerCards.push(cards.pop());

  updateView();
};

// 這個遊戲為了簡單，輸贏只有訊息不同而已，最後都是以 gameover function 結束
var gameOver = function(message) {
  result.textContent = message;
  gameOverToggle.checked = true;
  updateView();
};

// 叫牌
var hit = function() {
  // write your code at here
  // 7. 從整副牌取出一張牌給玩家（同第四題）
  playerCards.push(cards.pop());

  updateView();
  
  if (calculatePoints(playerCards) > 21) {
    gameOver('爆了！');
  }
};

// 停止叫牌
var stand = function() {
  // 21 點有一項規則，一旦玩家停止叫牌，莊家的點數如果小於17點，莊家要持續補牌
  while(calculatePoints(dealerCards) < 17) {
    // write your code at here
    // 8. 從整副牌取出一張牌給莊家（同第四題）
    //    這一題要小心，如果做錯了，這個 while 迴圈會永遠停不下來造成瀏覽器分頁當掉
    dealerCards.push(cards.pop());

    updateView();
  }

  // 遊戲結果計算
  // write your code at here
  // 10. 宣告一個變數，用來存放玩家的點數。使用 calculatePoints function 代入玩家的牌可得到總點數。
  var playerPoints = calculatePoints(playerCards);

  // 11. 宣告令一個變數，用來存放莊家的點數。同上題
  var dealerPoints = calculatePoints(dealerCards);

  // 12. 使用 if 控制流程判斷 第10題 與 第11題 的變數，決定輸贏結果（輸、贏、平手）
  //     代入不同的訊息到 gameOver function。（需要注意莊家有可能超過 21 點也算輸）
  if (dealerPoints > 21) {
    gameOver('莊暴！你贏了');
  } else if (dealerPoints == playerPoints) {
    gameOver('平手');
  } else if (dealerPoints > playerPoints) {
    gameOver('你輸了');
  } else {
    gameOver('你贏了')
  }
};

// 代入一組牌，回傳這一組牌的總點數
var calculatePoints = function(cards) {
  var score = 0, aceCount = 0;

  // 把每一張卡片取出來加總點數
  for(var i = 0; i < cards.length; i++) {
    var value = cards[i].value;
    score += value;

    // 點數若為11表示是 Ace
    if (value == 11) {
      aceCount++;
    }
  }

  // 這是一個21點的最佳計算方式
  // 一開始都把 ace 當做 11 點，如果最後總點數超過 21，而且牌裡面有 n 張 ace，則有 n 次減 10 的機會
  while(score > 21 && (aceCount-- > 0)) {
    score -= 10;
  }

  return score;
};

// 將陣列裡的元素重新排序
// 這一部分程式碼有些複雜，可先忽略
var shuffle = function (array) {
  var j, x, i;
  for (i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array[i];
      array[i] = array[j];
      array[j] = x;
  }
}

// 網頁載入時初始化遊戲
initGame();

// write your code at here
// 5. 對「叫牌」這顆按鈕做「點擊」事件綁定，每次點擊時執行 hit function。(按鈕已經存於 hitBtn 這個變數了)
// 9. 對「停止叫牌」這顆按鈕做「點擊」事件綁定，每次點擊時執行 stand function。(按鈕已經存於 standBtn 這個變數了)
//    需與第8題一起完成。若沒有先完成第8題，而先做這題，當按鈕按下時，會造成第8題的 white loop 陷入無窮迴圈。 
// 6. 對「再玩一次」這顆按鈕做「點擊」事件綁定，每次點擊時執行 initGame function。(按鈕已經存於 resetBtn 這個變數了)
hitBtn.addEventListener('click',hit);
standBtn.addEventListener('click',stand);
resetBtn.addEventListener('click',initGame);