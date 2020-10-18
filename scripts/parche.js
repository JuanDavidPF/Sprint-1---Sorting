let liderX;
let liderY;
let liderSize;
let followSize;
let leaderNames;
let initials;
function setup() {
  var myCanvas = createCanvas(900, 900);
  myCanvas.parent("parche");

  liderSize = 60;
  followSize = 20;
  liderY = height / 2;
  liderX = width / 2;
}

function Represent() {
  clear();
  noStroke();
  let parcheSimilitud = [];

  //title
  textAlign(LEFT, CENTER);
  textSize(20);
  fill(250, 100, 60);
  leaderNames = liderDelParche[0].split(" ");
  initials = "";

  for (let i = 0; i < leaderNames.length; i++) {
    initials += leaderNames[i].substring(0, 1);
  }

  text("El parche de " + liderDelParche[0], 40, 0, width / 2, 100);

  textAlign(CENTER, CENTER);

  //shuffle array

  parche = pyramid(parche);
  console.log(parche);
  //calculate distances

  for (let i = 0; i < parche.length; i++) {
    fill(250, 100, 60);
    stroke(250, 100, 60);
    x = map(
      parche[i][parche[i].length - 1],
      mayorSimilitud,
      menorSimilitud,
      liderSize * 2 + 150,
      width + 50
    );

    push();

    translate(100, 120);
    angleMode(DEGREES);

    angle = map(i, 0, parche.length - 1, 0, 90);

    rotate(angle);
    ellipse(x, 0, followSize, followSize);

    strokeWeight(0.2);
    stroke(225, 225, 225);
    line(0, 0, x, 0);

    noStroke();

    fill(255, 255, 255);
    textSize(16);
    text(
      parche[i][0] + " ( " + parche[i][parche[i].length - 1].toFixed(2) + " )",
      x,
      0 + followSize / 2 - 30
    );

    //////////////////////////////////////orbit guides
    radios = [];

    for (let j = 0; j < parche.length; j++) {
      radios.push(parche[j][parche[j].length - 1]);
    }

    menorRadio = Math.max.apply(Math, radios);
    mayorRadio = Math.min.apply(Math, radios);
    noFill();
    strokeWeight(0.3);

    if (parche[i][parche[i].length - 1] == mayorRadio) {
      stroke(250, 10, 10);
      ellipse(0, 0, x * 2, x * 2);
    }
    if (parche[i][parche[i].length - 1] == menorRadio) {
      stroke(10, 250, 10);
      ellipse(0, 0, x * 2, x * 2);
    }
    ////////////////////////////////////////////
    pop();
  }

  //lider
  fill(250, 100, 60);

  push();
  translate(100, 120);
  ellipse(0, 0, liderSize, liderSize);

  fill(255, 255, 255);
  textSize(25);
  text(initials, 0, 0);
  pop();
}

function pyramid(arr) {
  var newArr = [];

  // sort numerically
  arr.sort(function (a, b) {
    a = parseFloat(a[a.length - 1]);
    b = parseFloat(b[b.length - 1]);
    return b - a;
  });

  // put the biggest in new array
  newArr.push(arr.pop());

  // keep grabbing the biggest remaining item and alternate
  // between pushing and unshifting onto the new array
  while (arr.length) {
    newArr[arr.length % 2 === 0 ? "push" : "unshift"](arr.pop());
  }

  return newArr;
}
