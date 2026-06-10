let inning = 1;
let outs = 0;
let awayScore = 0;
let homeScore = 0;
let bases = [0, 0, 0];
let isAttack = true;
let startTime;

function loadQuestion() {
  const q = questions[Math.floor(Math.random() * questions.length)];
  document.getElementById("question").innerText = q.q;

  const box = document.getElementById("options");
  box.innerHTML = "";

  startTime = new Date().getTime();

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt, q.answer);
    box.appendChild(btn);
  });
}

function checkAnswer(selected, answer) {
  const time = (new Date().getTime() - startTime) / 1000;

  if (selected == answer) {
    let result = getHitType(time);
    advanceBases(result);
  } else {
    outs++;
    if (outs >= 3) changeHalfInning();
  }

  updateUI();
  loadQuestion();
}

function getHitType(time) {
  if (time <= 3) return "HR";
  if (time <= 6) return "3B";
  if (time <= 9) return "2B";
  return "1B";
}

function advanceBases(type) {
  let runs = 0;

  if (type === "HR") {
    runs = 1 + bases.reduce((a,b)=>a+b,0);
    bases = [0,0,0];
  }

  if (type === "3B") {
    runs += bases[2] + bases[1] + bases[0];
    bases = [0,0,1];
  }

  if (type === "2B") {
    runs += bases[2] + bases[1];
    bases = [0,1,bases[0]];
  }

  if (type === "1B") {
    runs += bases[2];
    bases = [1,bases[0],bases[1]];
  }

  if (isAttack) awayScore += runs;
  else homeScore += runs;
}

function changeHalfInning() {
  outs = 0;
  bases = [0,0,0];
  isAttack = !isAttack;

  if (!isAttack) inning++;
}

function switchTurn() {
  isAttack = !isAttack;
  outs = 0;
  bases = [0,0,0];
  updateUI();
}

function updateUI() {
  document.getElementById("inning").innerText = inning;
  document.getElementById("outs").innerText = outs;
  document.getElementById("awayScore").innerText = awayScore;
  document.getElementById("homeScore").innerText = homeScore;

  document.getElementById("bases").innerText =
    bases.map(b => b ? "🟡" : "⚪").join(" ");
}

loadQuestion();
updateUI();
