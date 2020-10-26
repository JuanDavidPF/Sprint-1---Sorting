let storedDatabase;

var userList = document.getElementById("usersList");
let sujeto1 = document.querySelector(".sujeto1");
let sujeto2 = document.querySelector(".sujeto2");
let sujetoParche = document.querySelector(".sujetoParche");
let parcheSize = document.querySelector("#parcheSize");
let filter = document.querySelector(".filter");
let orden = document.querySelector(".order");
let content = document.querySelector(".content");
let modal = document.querySelector(".modal");
let rangeContainer = document.querySelector(".sliderContainer");
let sliderPrefab = document.querySelector(".slider");

var sortOrder = "";
var sortParameter = "";
var compareUser1 = "";
var compareUser2 = "";
var parcheLeader = "";
let similitudCoseno = 0;
let liderDelParche;
let parche = [];
let arrayOriginalSize;
let mayorSimilitud;
let menorSimilitud;
let importanceLevels = [];
let importanceLevelsRange = [];
let parcheSimilitud = [];

const CSVField = document.getElementById("database");
CSVField.addEventListener("change", loadDataBase, false);

function loadDataBase() {
  const fileList = this.files;
  var file = fileList[0];
  filter.length = 0;
  Papa.parse(file, {
    complete: function (results) {
      storedDatabase = results.data;
      arrayOriginalSize = storedDatabase[0].length;

      RestartVisualDatabase(storedDatabase);
    },
  });
}

function Sort() {
  if (storedDatabase) {
    //recupera los filtros seleccionados
    GetFilterInputs();

    storedDatabase.sort(function (a, b) {
      let valor = sortParameter + 1;

      //fixed local machine puntuation
      a = parseFloat(a[valor]);
      b = parseFloat(b[valor]);

      if (sortOrder == 0) return a - b;
      else if (sortOrder == 1) return b - a;
    });

    RestartVisualDatabase(storedDatabase);
  } else alert("No se ha subido una base de datos");
}

function RestartVisualDatabase(database) {
  DeleateVisualDatabase();
  DeleteImportanceLevels();
  CreateVisualDatabase(database);
  CreateImportanceLevels(database);
}

function CreateVisualDatabase(database) {
  for (let i = 0; i < database.length; i++) {
    let userData = database[i];

    //tarjeton de usuarios
    var newUser = document.createElement("div");
    newUser.classList.add("users");

    //nombre del usuario
    var newName = document.createElement("div");
    var NameContent = document.createTextNode(userData[0] + "");
    newName.appendChild(NameContent);
    newUser.appendChild(newName);

    //agregar nombre a la listas de comparacion

    if (i > 0) {
      let option = document.createElement("option");
      option.value = NameContent.textContent.toLowerCase();
      option.text = NameContent.textContent;
      sujeto1.add(option);

      let option2 = document.createElement("option");
      option2.value = NameContent.textContent.toLowerCase();
      option2.text = NameContent.textContent;
      sujeto2.add(option2);

      let option3 = document.createElement("option");
      option3.value = NameContent.textContent.toLowerCase();
      option3.text = NameContent.textContent;
      sujetoParche.add(option3);
    }

    //crear filtros si no existen
    if (filter.length == 0) {
      for (let i = 1; i < userData.length; i++) {
        let option = document.createElement("option");
        option.value = userData[i].toLowerCase();
        option.text = "Valor " + userData[i];

        filter.add(option);
      }
    }

    //valores del usuario
    for (let i = 1; i < userData.length; i++) {
      var field = document.createElement("div");
      var value = document.createTextNode(userData[i] + "");
      field.appendChild(value);
      newUser.appendChild(field);
    }

    // añade el tarjeton al DOM de listas de tarjetones
    userList.appendChild(newUser);
  }
}

function DeleateVisualDatabase() {
  userList.querySelectorAll("*").forEach((n) => n.remove());

  sujeto1.length = 0;
  sujeto2.length = 0;
  sujetoParche.length = 0;
}

function CreateImportanceLevels(database) {
  for (let i = 1; i < database[0].length; i++) {
    let importanceLevel = sliderPrefab.cloneNode(true);
    importanceLevel.children[0].innerText = database[0][i];
    importanceLevel.children[1].value = 0;
    rangeContainer.appendChild(importanceLevel);
    importanceLevelsRange[i - 1] = importanceLevel;
    importanceLevels[i - 1] = importanceLevel.children[1].value / 100;
  }
  sliderPrefab.style.display = "none";
}

function DeleteImportanceLevels() {
  sliderPrefab.style.display = "block";
  for (let i = 0; i < rangeContainer.length; i++) {
    rangeContainer.removeChild(rangeContainer[i]);
  }
}

function GetImportanceLevels() {
  importanceLevels = [];
  for (let i = 0; i < importanceLevelsRange.length; i++) {
    importanceLevels[i] = importanceLevelsRange[i].children[1].value / 100;
    importanceLevels[i] = map(importanceLevels[i], 0, 1, 1, 0.1);
  }
}
function GetFilterInputs() {
  sortParameter = filter.options.selectedIndex;
  sortOrder = orden.options.selectedIndex;
}

function Compare() {
  if (storedDatabase) {
    compareUser1 = sujeto1.options.selectedIndex;
    compareUser2 = sujeto2.options.selectedIndex;

    user1Data = [];
    user2Data = [];

    //recupera cada valor por separado
    for (let i = 1; i < storedDatabase[compareUser1 + 1].length; i++) {
      user1Data[i - 1] = storedDatabase[compareUser1 + 1][i];
    }

    for (let i = 1; i < storedDatabase[compareUser2 + 1].length; i++) {
      user2Data[i - 1] = storedDatabase[compareUser2 + 1][i];
    }

    similitudCoseno = Semejanza(user1Data, user2Data);

    alert(
      "El índice de similitud entre " +
        storedDatabase[compareUser1 + 1][0] +
        " y " +
        storedDatabase[compareUser2 + 1][0] +
        " es de: " +
        similitudCoseno.toFixed(2)
    );
  } else alert("No se ha subido una base de datos");
}

function SemejanzaPonderada(sujeto1Data, sujeto2Data) {
  //////////////CALCULO DE LA SEMEJANZA/////////////

  // Paso 1: calculo del producto punto

  let productoPunto = 0;

  for (let i = 0; i < arrayOriginalSize - 1; i++) {
    a = parseFloat(sujeto1Data[i]);
    b = parseFloat(sujeto2Data[i]);
    productoPunto += a * b * importanceLevels[i];
  }

  // Paso 2: calculo de la magnitud
  let magnitudA = 0;
  let magnitudB = 0;

  for (let i = 0; i < sujeto1Data.length; i++) {
    a = parseFloat(sujeto1Data[i]);
    b = parseFloat(sujeto2Data[i]);

    magnitudA += Math.pow(a, 2);
    magnitudB += Math.pow(b, 2);
  }

  magnitudA = Math.sqrt(magnitudA);
  magnitudB = Math.sqrt(magnitudB);

  // Paso 3: calculo de la similitud del coseno

  similitudCoseno = productoPunto / (magnitudA * magnitudB);
  return similitudCoseno;
}

function Semejanza(sujeto1Data, sujeto2Data) {
  //////////////CALCULO DE LA SEMEJANZA/////////////

  // Paso 1: calculo del producto punto

  let productoPunto = 0;

  for (let i = 0; i < sujeto1Data.length; i++) {
    a = parseFloat(sujeto1Data[i]);
    b = parseFloat(sujeto2Data[i]);
    productoPunto += a * b;
  }

  // Paso 2: calculo de la magnitud
  let magnitudA = 0;
  let magnitudB = 0;

  for (let i = 0; i < sujeto1Data.length; i++) {
    a = parseFloat(sujeto1Data[i]);
    b = parseFloat(sujeto2Data[i]);

    magnitudA += Math.pow(a, 2);
    magnitudB += Math.pow(b, 2);
  }

  magnitudA = Math.sqrt(magnitudA);
  magnitudB = Math.sqrt(magnitudB);

  // Paso 3: calculo de la similitud del coseno

  similitudCoseno = productoPunto / (magnitudA * magnitudB);
  return similitudCoseno;
}

document.addEventListener("click", function (v) {
  if (v.target == modal) {
    modal.classList.remove("activated");
    content.classList.remove("hidden");
    setTimeout(function () {
      modal.style.display = "none";
    }, 300);
  }
});

function Parchar() {
  if (storedDatabase) {
    GetImportanceLevels();
    content.classList.add("hidden");
    modal.style.display = "flex";

    setTimeout(function () {
      modal.classList.add("activated");
    }, 1);

    leaderIndex = sujetoParche.options.selectedIndex;
    parcheSize.innerHTML = "hola";
    leaderData = [];
    let otherData = [];
    parche = [];
    semejanza = [];
    size = parseInt(parcheSize.value);
    databaseReference = storedDatabase.slice(0);
    databaseReference.shift();

    //recupera el valor del lider
    for (let i = 0; i < databaseReference[leaderIndex].length; i++) {
      leaderData.push(databaseReference[leaderIndex][i]);
    }
    leaderData.shift();

    //recupera el valor de todos l
    for (otherIndex = 0; otherIndex < databaseReference.length; otherIndex++) {
      for (let i = 0; i < databaseReference[leaderIndex].length; i++) {
        otherData.push(databaseReference[otherIndex][i]);
      }
      otherData.shift();
      semejanza = SemejanzaPonderada(leaderData, otherData);
      databaseReference[otherIndex][arrayOriginalSize] = semejanza;
      if (otherIndex == leaderIndex) {
        liderDelParche = databaseReference[otherIndex];
        databaseReference[otherIndex][arrayOriginalSize] = 0;
      }
      parche.push(databaseReference[otherIndex]);

      otherData = [];
    } //for of everyone in the list

    parche.sort(function (a, b) {
      a = parseFloat(a[a.length - 1]);
      b = parseFloat(b[b.length - 1]);
      return b - a;
    });

    parche.pop();
    parcheSimilitud.length = 0;
    for (let i = 0; i < parche.length; i++) {
      parcheSimilitud.push(parche[i][parche[i].length - 1]);
    }

    mayorSimilitud = Math.max.apply(Math, parcheSimilitud);
    menorSimilitud = Math.min.apply(Math, parcheSimilitud);

    parche = parche.slice(0, size);
    Represent();
  } else alert("No se ha subido una base de datos");
} //closes parchar

function Export() {
  let CSV = Papa.unparse(storedDatabase);
  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(CSV);
  hiddenElement.target = "_blank";
  hiddenElement.download = "Datos Sorteados.csv";
  hiddenElement.click();
}
