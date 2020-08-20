let storedDatabase;

var userList = document.getElementById("usersList");
var sortOrder = "";
var sortParameter = "";

const CSVField = document.getElementById("database");
CSVField.addEventListener("change", loadDataBase, false);

function loadDataBase() {
  const fileList = this.files;
  var file = fileList[0];

  Papa.parse(file, {
    complete: function (results) {
      storedDatabase = results.data;
      CreateVisualDatabase(storedDatabase);
    },
  });
}

function Sort() {
  if (storedDatabase) {
    //recupera los filtros seleccionados
    GetFilterInputs();

    storedDatabase.sort(function (a, b) {
      let valor = 0;
      if (sortParameter == "Valor A") {
        valor = 1;
      } else if (sortParameter == "Valor B") {
        valor = 2;
      }

      a = parseFloat(a[valor]);
      b = parseFloat(b[valor]);

      if (sortOrder == "Descendente") return b - a;
      else if (sortOrder == "Ascendente") return a - b;
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

    //valores del usuario
    var fieldA = document.createElement("div");
    var valueA = document.createTextNode(userData[1] + "");
    fieldA.appendChild(valueA);

    var fieldB = document.createElement("div");
    var valueB = document.createTextNode(userData[2] + "");
    fieldB.appendChild(valueB);

    //añade la informacion al tarjeton del usuario
    newUser.appendChild(newName);
    newUser.appendChild(fieldA);
    newUser.appendChild(fieldB);

    // añade el tarjeton al DOM de listas de tarjetones

    userList.appendChild(newUser);
  }
}

function DeleateVisualDatabase() {
  userList.querySelectorAll("*").forEach((n) => n.remove());
}

function GetFilterInputs() {
  let filter = document.querySelector(".filter");
  sortParameter = filter.options[filter.selectedIndex].text;

  let orden = document.querySelector(".order");
  sortOrder = orden.options[orden.selectedIndex].text;
}

function Export() {
  let CSV = Papa.unparse(storedDatabase);
  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(CSV);
  hiddenElement.target = "_blank";
  hiddenElement.download = "Datos Sorteados.csv";
  hiddenElement.click();
}
