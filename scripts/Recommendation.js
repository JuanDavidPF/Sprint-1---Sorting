///////////////////////////////////////////////////
///////////////////////////////////////////////////

let UsersDatabase;
let UsersDatabaseOriginalSize;

let ProductsDatabase;
let ProductsDatabaseOriginalSize;

var userList = document.getElementById("usersList");
var productList = document.getElementById("productsList");

const UsersDatabaseField = document.getElementById("usersDatabase");
UsersDatabaseField.addEventListener("change", loadUsersDataBase, false);

const ProductsDatabaseField = document.getElementById("productsDatabase");
ProductsDatabaseField.addEventListener("change", loadProductsDataBase, false);

///////////////////////////////////////////////////
///////////////////////////////////////////////////

let algorithm = document.getElementById("Algorithm").options;
let PlayListSize = document.getElementById("PlayListSize");
let PlayListDuration;

///////////////////////////////////////////////////
///////////////////////////////////////////////////

let users = [];
let selectedUsers = [];

function setup() {} //closes setup method

function loadUsersDataBase() {
  const fileList = this.files;
  var file = fileList[0];

  Papa.parse(file, {
    complete: function (results) {
      UsersDatabase = results.data;
      UsersDatabaseOriginalSize = UsersDatabase.length;
      CreateUserDatabase();
    },
  });
} //closes loadDatabases method

function loadProductsDataBase() {
  const fileList = this.files;
  var file = fileList[0];

  Papa.parse(file, {
    complete: function (results) {
      ProductsDatabase = results.data;
      ProductsDatabaseOriginalSize = ProductsDatabase.length;
      CreateProductDatabase();
    },
  });
} //closes loadDatabases method

function CreateUserDatabase() {
  DeleteVisualUserDatabase();
  DrawVisualUserDatabase();
} //closes CreateDatabase medog

function CreateProductDatabase() {
  DeleteVisualProductsDatabase();
  DrawVisualProductsDatabase();
} //closes CreateDatabase medog

function DeleteVisualUserDatabase() {
  userList.querySelectorAll("*").forEach((n) => n.remove());
} //closes DeleateVisualDatabase method

function DeleteVisualProductsDatabase() {
  productList.querySelectorAll("*").forEach((n) => n.remove());
} //closes DeleateVisualDatabase method

function DrawVisualUserDatabase() {
  for (let i = 0; i < UsersDatabase.length; i++) {
    let userData = UsersDatabase[i];

    //tarjeton de usuarios
    var newUser = document.createElement("div");
    newUser.classList.add("users");

    //nombre del usuario
    var newName = document.createElement("div");
    var NameContent = document.createTextNode(userData[0] + "");
    newName.appendChild(NameContent);
    newUser.appendChild(newName);

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

  users = document.querySelectorAll(".users");
  ClickUser();
  CheckForUsersSelected();
} //Closes DrawVisualDatabase method

function DrawVisualProductsDatabase() {
  for (let i = 0; i < ProductsDatabase.length; i++) {
    let productData = ProductsDatabase[i];

    //tarjeton de products
    var newProduct = document.createElement("div");
    newProduct.classList.add("products");

    //nombre del usuario
    var newName = document.createElement("div");
    var NameContent = document.createTextNode(productData[0] + "");
    newName.appendChild(NameContent);
    newProduct.appendChild(newName);

    //valores del usuario
    for (let i = 1; i < productData.length; i++) {
      var field = document.createElement("div");
      var value = document.createTextNode(productData[i] + "");
      field.appendChild(value);
      newProduct.appendChild(field);
    }

    // añade el tarjeton al DOM de listas de tarjetones
    productList.appendChild(newProduct);
  }
} //Closes DrawVisualDatabase method

function CheckForUsersSelected() {
  for (let i = 1; i < UsersDatabase.length; i++) {
    for (let j = 0; j < selectedUsers.length; j++) {
      let isTheSameUser = true;

      //checks if the values are the same
      for (let k = 0; k < selectedUsers[j].length; k++) {
        if (UsersDatabase[i][k + 1] != selectedUsers[j][k]) {
          isTheSameUser = false;
          break;
        }
      }

      if (isTheSameUser) {
        let userSelected = users[i].firstElementChild;
        userSelected.classList.add("selected");
        break;
      }
    }
  }
} //Closes CheckForUsersSelected method

function ClickUser() {
  for (let i = 1; i < users.length; i++) {
    let userName = users[i].firstElementChild;

    userName.addEventListener("click", function () {
      if (userName.classList.contains("selected"))
        userName.classList.remove("selected");
      else userName.classList.add("selected");
    });
  }
} //Closes ClickUser method

function Recomendar() {
  if (UsersDatabase && ProductsDatabase) {
    selectedUsers = [];

    //looks for users that were selected
    for (let i = 1; i < UsersDatabaseOriginalSize; i++) {
      let user = document.querySelectorAll(".users")[i].firstElementChild;
      if (user.classList.contains("selected"))
        selectedUsers.push(Array.from(UsersDatabase[i]));
    }

    //remove names from the user
    for (let i = 0; i < selectedUsers.length; i++) {
      selectedUsers[i].shift();
    }

    if (selectedUsers.length > 0) {
      //executes the algorithm selected
      switch (algorithm.selectedIndex) {
        case 0:
          ArmarPizza(NaiveMethod());

          break;
        case 1:
          ArmarPizza(LeastMiserysMethod());

          break;
        case 2:
          ArmarPizza(MaximumPleasureMethod());

          break;
        case 3:
          ArmarPizza(MediaSatisfactionMethod());

          break;
        case 4:
          ArmarPizza(HiperMegaPayanMethod());

          break;
      }
    }
  }
} //Closes Recomendar method

function NaiveMethod() {
  let ArrayOfArrays = JSON.parse(JSON.stringify(selectedUsers));
  let protoPersona = AverageArrayValues(
    AddArrayValues(ArrayOfArrays),
    ArrayOfArrays.length
  );
  return protoPersona;
} //closes NaiveMethod method

function LeastMiserysMethod() {
  let ArrayOfArrays = JSON.parse(JSON.stringify(selectedUsers));
  let protoPersona = RemoveElementForAllUserBelowTreshold(ArrayOfArrays, 5);
  protoPersona = AverageArrayValues(
    AddArrayValues(protoPersona),
    protoPersona.length
  );
  return protoPersona;
} //closes LeastMiserysMethod method

function MaximumPleasureMethod() {
  let ArrayOfArrays = JSON.parse(JSON.stringify(selectedUsers));

  let protoPersona = AverageArrayValues(
    AddArrayValues(ArrayOfArrays),
    ArrayOfArrays.length
  );

  let hasPleasure = DetectHighpoint(ArrayOfArrays, 8);
  hasPleasure = AverageArrayValues(
    AddArrayValues(hasPleasure),
    hasPleasure.length
  );
  protoPersona = AddFromArrayBasedOnArray(protoPersona, hasPleasure, 11);

  return protoPersona;
} //closes MaximumPleasureMethod method

function MediaSatisfactionMethod() {
  let ArrayOfArrays = JSON.parse(JSON.stringify(selectedUsers));
  let protoPersona = AverageArrayValues(
    AddArrayValues(ArrayOfArrays),
    ArrayOfArrays.length
  );
  let deviation = StandardDeviation(ArrayOfArrays, protoPersona);
  deviation = RemoveElementsAboveTreshold(deviation, 3);
  protoPersona = RemoveFromArrayBasedOnArray(protoPersona, deviation, 0);

  return protoPersona;
} //closes MediaSatisfactionMethod method

function HiperMegaPayanMethod() {
  let ArrayOfArrays = JSON.parse(JSON.stringify(selectedUsers));
  let protoPersona = RemoveElementForAllUserBelowTreshold(ArrayOfArrays, 2);

  protoPersona = RemapData(protoPersona);
  protoPersona = AverageArrayValues(
    AddArrayValues(protoPersona),
    ArrayOfArrays.length
  );
  return protoPersona;
} //closes HiperMegaPayanMethod method

function DisplayRecommendation(recommendation) {
  let recomendationField = document.querySelector(".recommendationText");
  recomendationField.setAttribute('style', 'white-space: pre;');

  recomendationField.textContent = recommendation;
} //closes CalculateRecommendation method

function ShowProtopersona(persona) {
  UsersDatabase[UsersDatabaseOriginalSize] = persona;
  CreateUserDatabase();
} //closes ShowProtopersona method

function AddArrayValues(arrayOfArrays) {
  let resultArray = [];
  let valor = 0;

  //adds every value of every person selected
  for (let j = 0; j < arrayOfArrays[0].length; j++) {
    for (let i = 0; i < arrayOfArrays.length; i++) {
      valor += parseFloat(arrayOfArrays[i][j]);

      if (i == arrayOfArrays.length - 1) {
        resultArray.push(valor);
        valor = 0;
      }
    }
  } //closes DobleFor

  return resultArray;
} //closes AddArrayValues method

function AverageArrayValues(array, amountOfArrays) {
  for (let i = 0; i < array.length; i++) {
    array[i] /= amountOfArrays;
    array[i] = Math.round(array[i] * 100) / 100;
  }

  return array;
} //closes AverageArrayValues method

function StandardDeviation(values, averages) {
  let result = [];
  let valor = 0;

  //calculates averages

  for (let j = 0; j < values[0].length; j++) {
    for (let i = 0; i < values.length; i++) {
      valor += sq(parseFloat(values[i][j]) - averages[j]);

      if (i == values.length - 1) {
        valor /= values.length - 1;
        valor = sqrt(valor);
        valor = Math.round(valor * 100) / 100;
        result.push(valor);
        valor = 0;
      }
    }
  } //closes doble for

  return result;
} //closes StandardDeviation method

function RemoveElementsBelowTreshold(array, minLimit) {
  //adds every value of every person selected

  for (let i = 0; i < array.length; i++) {
    array[i] = parseFloat(array[i]);
    if (array[i] < minLimit) array[i] = 0;
  }
  return array;
} //closes RemoveElementsBelowTreshold method

function RemoveElementsAboveTreshold(array, maxLimit) {
  for (let i = 0; i < array.length; i++) {
    array[i] = parseFloat(array[i]);
    if (array[i] > maxLimit) array[i] = 0;
  }
  return array;
} //closes RemoveElementsAboveTreshold method

function RemoveElementForAllUserBelowTreshold(arrayOfArrays, minLimit) {
  for (let valIndex = 0; valIndex < arrayOfArrays[0].length; valIndex++) {
    for (let perIndex = 0; perIndex < arrayOfArrays.length; perIndex++) {
      if (arrayOfArrays[perIndex][valIndex] < minLimit) {
        for (let perIndex2 = 0; perIndex2 < arrayOfArrays.length; perIndex2++) {
          arrayOfArrays[perIndex2][valIndex] = 0;
        }
        break;
      }
    }
  } //closes DobleFor

  return arrayOfArrays;
} //closes RemoveElementForAllUserBelowTreshold method

function RemoveElementForAllUserAboveTreshold(arrayOfArrays, maxLimit) {
  for (let valIndex = 0; valIndex < arrayOfArrays[0].length; valIndex++) {
    for (let perIndex = 0; perIndex < arrayOfArrays.length; perIndex++) {
      if (arrayOfArrays[perIndex][valIndex] > maxLimit) {
        for (let perIndex2 = 0; perIndex2 < arrayOfArrays.length; perIndex2++) {
          arrayOfArrays[perIndex2][valIndex] = 0;
        }
        break;
      }
    }
  } //closes DobleFor

  let resultArrayOfArrays = arrayOfArrays;
  return resultArrayOfArrays;
} //closes RemoveElementForAllUserAboveTreshold method

function DetectHighpoint(arrayOfArrays, reach) {
  for (let valIndex = 0; valIndex < arrayOfArrays[0].length; valIndex++) {
    for (let perIndex = 0; perIndex < arrayOfArrays.length; perIndex++) {
      if (arrayOfArrays[perIndex][valIndex] >= reach) {
        for (let perIndex2 = 0; perIndex2 < arrayOfArrays.length; perIndex2++) {
          arrayOfArrays[perIndex2][valIndex] = 11;
        }
        break;
      }
    }
  } //closes DobleFor

  let resultArrayOfArrays = arrayOfArrays;
  return resultArrayOfArrays;
} //closes RemoveElementForAllUserAboveTreshold method

function RemapData(arrayOfArrays) {
  for (let i = 0; i < arrayOfArrays.length; i++) {
    let minValue = [];
    for (let k = 0; k < arrayOfArrays[i].length; k++) {
      if (arrayOfArrays[i][k] != 0) minValue.push(arrayOfArrays[i][k]);
    }
    minValue = min(minValue);
    let maxValue = max(arrayOfArrays[i]);

    for (let j = 0; j < arrayOfArrays[i].length; j++) {
      arrayOfArrays[i][j] = int(
        map(arrayOfArrays[i][j], minValue, maxValue, 1, 10)
      );

      if (arrayOfArrays[i][j] <= 0) arrayOfArrays[i][j] = 0;
    }
  }

  return arrayOfArrays;
} //closes RemapData method

function RelativePercent(array) {
  let addition = 0;

  for (let i = 0; i < array.length; i++) {
    addition += array[i];
  }

  for (let i = 0; i < array.length; i++) {
    if (array[i] != 0 && addition != 0)
      array[i] = int((array[i] / addition) * 10);
    else array[i] = 0;
  }

  return array;
}

function RemoveFromArrayBasedOnArray(array1, array2, condition) {
  for (let i = 0; i < array2.length; i++) {
    if (array2[i] == condition) array1[i] = condition;
  }
  return array1;
} //closes RemoveFromArrayBasedOnArray method

function AddFromArrayBasedOnArray(array1, array2, condition) {
  for (let i = 0; i < array2.length; i++) {
    if (array2[i] != condition) array1[i] = 0;
  }
  return array1;
} //closes RemoveFromArrayBasedOnArray method

function ArmarPizza(persona) {
  console.log(persona);

  if (UsersDatabase && ProductsDatabase) {
    let leaderData = JSON.parse(JSON.stringify(persona));
    leaderData.unshift("Protopersona");

    let otherData = JSON.parse(JSON.stringify(ProductsDatabase));
    otherData.shift();

    let parche = [];
    let semejanza = 0;
    let size = parseInt(PlayListSize.value);

    //recupera el valor de todos las pizzas
    for (let i = 0; i < otherData.length; i++) {
      semejanza = SemejanzaProtopersona__Product(leaderData, otherData[i]);
      otherData[i][otherData[i].length] = semejanza;

      parche.push(otherData[i]);
    } //for of everyone in the list

    parche.sort(function (a, b) {
      a = parseFloat(a[a.length - 1]);
      b = parseFloat(b[b.length - 1]);
      return b - a;
    });

    parche = parche.slice(0, size);

    let recommendation = "Las mejores opciones son: \n" ;

    for (let i = 0; i < parche.length; i++) {
      recommendation +=
        " Pizza " +
        parche[i][0] +
        " (" +
        parche[i][parche[i].length - 1].toFixed(2) +
        ")\n";
    }

    DisplayRecommendation(recommendation);
    ShowProtopersona(leaderData);
  } else alert("No se ha subido una base de datos");
} //closes parchar

function SemejanzaProtopersona__Product(protopersonaData, productoData) {
  //////////////CALCULO DE LA SEMEJANZA/////////////

  // Paso 1: calculo del producto punto

  let productoPunto = 0;

  for (let i = 1; i < protopersonaData.length; i++) {
    a = parseFloat(protopersonaData[i]);
    b = parseFloat(productoData[i]);
    productoPunto += a * b;
  }

  // Paso 2: calculo de la magnitud
  let magnitudA = 0;
  let magnitudB = 0;

  for (let i = 1; i < protopersonaData.length; i++) {
    a = parseFloat(protopersonaData[i]);
    b = parseFloat(productoData[i]);

    magnitudA += Math.pow(a, 2);
    magnitudB += Math.pow(b, 2);
  }

  magnitudA = Math.sqrt(magnitudA);
  magnitudB = Math.sqrt(magnitudB);

  // Paso 3: calculo de la similitud del coseno

  similitudCoseno = productoPunto / (magnitudA * magnitudB);
  return similitudCoseno;
}
