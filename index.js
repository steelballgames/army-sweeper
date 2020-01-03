Decimal.prototype.tof = function(x) {
  if (this.exponent >= 5 || this.exponent <= -5) {
    return r100(this.mantissa) + "e" + this.exponent;
  } else {
    return +this.toFixed(x);
  }
};
Decimal.prototype.flor = function(x) {
  return this.add(0.5).floor();
};
Decimal.prototype.gte = function(x) {
  return this.greaterThanOrEqualTo(x);
};
Decimal.prototype.lte = function(x) {
  return this.lessThanOrEqualTo(x);
};
Decimal.prototype.gt = function(x) {
  return this.greaterThan(x);
};
Decimal.prototype.lt = function(x) {
  return this.lessThan(x);
};
Element.prototype.qs = function(x) {
  return this.querySelector(x);
};
Element.prototype.qsa = function(x) {
  return this.querySelectorAll(x);
};
const tim = () => new Date().getTime();
const ssend = (stat, numb) => {
  kongregate.stats.submit(stat, numb);
};

const rdbt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const r100 = x => Math.round(x * 100) / 100;
const r10 = x => Math.round(x * 10) / 10;
var firstrun;
var cache = {};
var qs = function(query) {
  cache = cache || {};

  if (!cache[query]) {
    cache[query] = document.querySelector(query);
  }

  return cache[query];
};

const qsa = x => {
  return document.querySelectorAll(x);
};

var gd = {
  enemiesMax: 120,
  enemies: 120,

  previous: [],

  rows: 20,
  cols: 20,

  army: 50,
  lose: 4,
  loseDiag: 2,

  board: [],
  adjs: [],
  available: [],

  px: 0,
  py: 0,

  endx: 19,
  endy: 19
};
var gdbase;
var baseHtml;
$(() => {
  gdbase = _.cloneDeep(gd);
  baseHtml = qs("body").innerHTML;

  createGame();
  firstrun = true;

  mainGame();
});

const createGame = () => {
  restart()
  qs("#game-board").innerHTML = createBoard();
};

const mainGame = () => {
  gloop();
  domloop();
};

const gloop = () => {
  setTimeout(() => {
    updateGame();

    gloop();
    // }, gd.segtick.mul(1000).toNumber());
  }, 35);
};

const domloop = () => {
  setTimeout(() => {
    updateDom();

    domloop();
  }, 35);
};

const getId = (i, j, sz) => j + i * sz;

const getrow = (n, sz) => Math.floor(n / sz);
const getcol = (n, sz) => n % sz;

const selebox = (el, mb) => {
  // console.log(el.id, mb);
  let box = parseInt(el.id.replace("A", ""));
  let c = getcol(box, gd.cols);
  let r = getrow(box, gd.cols);


  if (gd.available[r][c] != 0) {
    if (
      (gd.board[r][c] == 1 && mb == "left") ||
      (gd.board[r][c] == 0 && mb == "right")
    ) {
      gd.army -= gd.lose;
    }

    if (gd.available[r][c] == 2) {
      gd.army -= gd.loseDiag;
    }

    if (gd.army <= 0) {
      alert("you lose");
      restart();
      return;
    }

    if (gd.board[r][c] == 3) {
      alert("you win");
      restart();
      return;
    }
    gd.board[r][c] = 2;
    return;



  }
};

const restart = () => {
  gd = _.cloneDeep(gdbase);
  createBoardGame();
  createEnemies();
  gd.available = zeros(0, [gd.rows, gd.cols]);
};

const updateGame = () => {
  checkAdjs();
};

const updateDom = () => {
  qs(".iarmy").textContent = gd.army;
  qs(".ienemies").textContent = gd.enemies;

  for (let i = 0; i < gd.rows; i++) {
    for (let j = 0; j < gd.cols; j++) {
      let csel = "";
      csel += gd.board[i][j] == 2 ? " cterry " : "";
      csel += gd.available[i][j] == 1 ? " cselected " : "";
      csel += gd.available[i][j] == 2 ? " cenemy " : "";
      qs("#A" + getId(i, j, gd.cols)).textContent = gd.adjs[i][j];
      qs("#A" + getId(i, j, gd.cols)).className = "box" + csel;
    }
  }

  if (!qs("#A" + getId(gd.endx, gd.endy, gd.cols)).classList.contains("cend")) {
    $(".box").removeClass("cend");
    qs("#A" + getId(gd.endx, gd.endy, gd.cols)).classList.add("cend");
  }
};

function zeros(n, dimensions) {
  var array = [];

  for (var i = 0; i < dimensions[0]; ++i) {
    array.push(dimensions.length == 1 ? n : zeros(n, dimensions.slice(1)));
  }

  return array;
}

const checkAdjs = () => {
  gd.available = zeros(0, [gd.rows, gd.cols]);

  for (let i = 0; i < gd.board.length; i++) {
    for (let j = 0; j < gd.board[i].length; j++) {
      if (gd.board[i][j] == 2) {
        gd.adjs[i][j] = 0;
        for (
          var i2 = Math.max(i - 1, 0);
          i2 <= Math.min(i + 1, gd.rows - 1);
          i2++
        ) {
          for (
            var j2 = Math.max(j - 1, 0);
            j2 <= Math.min(j + 1, gd.cols - 1);
            j2++
          ) {
            if (!(i == i2 && j == j2)) {
              if (gd.board[i2][j2] == 1) {
                gd.adjs[i][j]++;
              }
              if (gd.board[i2][j2] != 2) {
                gd.available[i2][j2] = 1;
              }
            }
          }
        }
      }
    }
  }

  for (let i = 0; i < gd.available.length; i++) {
    for (let j = 0; j < gd.available[i].length; j++) {
      if (
        gd.available[i][j] == 1 &&
        gd.board[Math.max(i - 1, 0)][j] != 2 &&
        gd.board[i][Math.max(j - 1, 0)] != 2 &&
        gd.board[Math.min(i + 1, gd.rows - 1)][j] != 2 &&
        gd.board[i][Math.min(j + 1, gd.cols - 1)] != 2
      ) {
        gd.available[i][j] = 2;
      }
    }
  }
};

window.oncontextmenu = function() {
  // selebox()
  return false; // cancel default menu
};

const createBoard = () => {
  let hstr = "";
  for (let i = 0; i < gd.rows; i++) {
    for (let j = 0; j < gd.cols; j++) {
      let n = getId(i, j, gd.rows);
      hstr += /* HTML */ `
        <div
          class="box"
          id="A${n}"
          onclick="selebox(this,'left')"
          oncontextmenu="selebox(this,'right')"
        ></div>
      `;
    }
  }
  return hstr;
};

const createBoardGame = () => {
  let bd = [];
  let adjs = [];
  for (let i = 0; i < gd.rows; i++) {
    let bd2 = [];
    let adjs2 = [];
    for (let j = 0; j < gd.cols; j++) {
      bd2.push(0);
      adjs2.push(null);
    }
    bd.push(bd2);
    adjs.push(adjs2);
  }
  gd.board = bd;
  gd.adjs = adjs;
};

const createEnemies = () => {
  var ct = 0;

  gd.board[0][0] = 2;
  gd.board[19][19] = 3;

  while (ct < gd.enemiesMax) {
    let row = rdbt(0, 19);
    let col = rdbt(0, 19);
    if (gd.board[row][col] == 0) {
      gd.board[row][col] = 1;
      ct++;
    }
  }
  // gd.board[0][0] = 0
  // gd.board[19][19] = 0
};
