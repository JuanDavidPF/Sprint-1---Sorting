let storedDatabase;

var userList = document.getElementById("usersList");
let sujeto1 = document.querySelector(".sujeto1");
let sujeto2 = document.querySelector(".sujeto2");
let filter = document.querySelector(".filter");
let orden = document.querySelector(".order");

var sortOrder = "";
var sortParameter = "";
var compareUser1 = "";
var compareUser2 = "";

let similitudCoseno = 0;

const CSVField = document.getElementById("database");
CSVField.addEventListener("change", loadDataBase, false);

function loadDataBase() {
  const fileList = this.files;
  var file = fileList[0];
  filter.length = 0;
  Papa.parse(file, {
    complete: function (results) {
      storedDatabase = results.data;
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
      a = parseFloat(a[valor].replace(",", "."));
      b = parseFloat(b[valor].replace(",", "."));

      if (sortOrder == 1) return b - a;
      else if (sortOrder == 0) return a - b;
    });

    RestartVisualDatabase(storedDatabase);
  }
}

function RestartVisualDatabase(database) {
  DeleateVisualDatabase();
  CreateVisualDatabase(database);
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
    } else {
      //crear filtros si no existen
      if (filter.length == 0) {
        for (let i = 1; i < userData.length; i++) {
          let option = document.createElement("option");
          option.value = userData[i].toLowerCase();
          option.text = "Valor " + userData[i];
          filter.add(option);
        }
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
}

function GetFilterInputs() {
  sortParameter = filter.options.selectedIndex;

  sortOrder = orden.options.selectedIndex;
}

function Compare() {
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

  //////////////CALCULO DE LA SEMEJANZA/////////////

  // Paso 1: calculo del producto punto

  let productoPunto = 0;

  for (let i = 0; i < user1Data.length; i++) {
    a = parseFloat(user1Data[i].replace(",", "."));
    b = parseFloat(user2Data[i].replace(",", "."));
    productoPunto += a * b;
  }

  // Paso 2: calculo de la magnitud
  let magnitudA = 0;
  let magnitudB = 0;

  for (let i = 0; i < user1Data.length; i++) {
    a = parseFloat(user1Data[i].replace(",", "."));
    b = parseFloat(user2Data[i].replace(",", "."));

    magnitudA += Math.pow(a, 2);
    magnitudB += Math.pow(b, 2);
  }

  magnitudA = Math.sqrt(magnitudA);
  magnitudB = Math.sqrt(magnitudB);

  // Paso 3: calculo de la similitud del coseno

  similitudCoseno = productoPunto / (magnitudA * magnitudB);

  alert(
    "El índice de similitud entre " +
      storedDatabase[compareUser1 + 1][0] +
      " y " +
      storedDatabase[compareUser2 + 1][0] +
      " es de: " +
      similitudCoseno.toFixed(2)
  );
}

function Export() {
  let CSV = Papa.unparse(storedDatabase);
  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(CSV);
  hiddenElement.target = "_blank";
  hiddenElement.download = "Datos Sorteados.csv";
  hiddenElement.click();
}
