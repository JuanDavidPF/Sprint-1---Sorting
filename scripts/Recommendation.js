///////////////////////////////////////////////////
///////////////////////////////////////////////////

let Database;
let DatabaseOriginalSize;
var userList = document.getElementById("usersList");
const CSVField = document.getElementById("database");
CSVField.addEventListener("change", loadDataBase, false);

///////////////////////////////////////////////////
///////////////////////////////////////////////////

let algorithm = document.getElementById("Algorithm").options;
let PlayListSize = document.getElementById("PlayListSize");
let PlayListDuration;
let TypeOfCalculation = document.getElementById("TypeOfCalculation").options;

///////////////////////////////////////////////////
///////////////////////////////////////////////////

let users = [];
let selectedUsers = [];

function setup() {} //closes setup method

function loadDataBase() {
  const fileList = this.files;
  var file = fileList[0];

  Papa.parse(file, {
    complete: function (results) {
      Database = results.data;
      DatabaseOriginalSize = Database.length;
      CreateDatabase();
    },
  });
} //closes loadDatabases method

function CreateDatabase() {
  DeleteVisualDatabase();
  DrawVisualDatabase();
} //closes CreateDatabase medog

function DeleteVisualDatabase() {
  userList.querySelectorAll("*").forEach((n) => n.remove());
} //closes DeleateVisualDatabase method

function DrawVisualDatabase() {
  for (let i = 0; i < Database.length; i++) {
    let userData = Database[i];

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

function CheckForUsersSelected() {
  for (let i = 1; i < Database.length; i++) {
    for (let j = 0; j < selectedUsers.length; j++) {
      let isTheSameUser = true;

      //checks if the values are the same
      for (let k = 0; k < selectedUsers[j].length; k++) {
        if (Database[i][k + 1] != selectedUsers[j][k]) {
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
  if (Database) {
    selectedUsers = [];

    //looks for users that were selected
    for (let i = 1; i < DatabaseOriginalSize; i++) {
      let user = document.querySelectorAll(".users")[i].firstElementChild;
      if (user.classList.contains("selected"))
        selectedUsers.push(Array.from(Database[i]));
    }

    //remove names from the user
    for (let i = 0; i < selectedUsers.length; i++) {
      selectedUsers[i].shift();
    }

    if (selectedUsers.length > 0) {
      //executes the algorithm selected
      switch (algorithm.selectedIndex) {
        case 0:
          CalculateRecommendation(NaiveMethod());
          break;
        case 1:
          CalculateRecommendation(LeastMiserysMethod());

          break;
        case 2:
          CalculateRecommendation(MaximumPleasureMethod());

          break;
        case 3:
          CalculateRecommendation(MediaSatisfactionMethod());

          break;
        case 4:
          CalculateRecommendation(HiperMegaPayanMethod());
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
  let protoPersona = RemoveElementForAllUserBelowTreshold(ArrayOfArrays, 8);
  protoPersona = AverageArrayValues(
    AddArrayValues(protoPersona),
    protoPersona.length
  );
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

function CalculateRecommendation(persona) {
  let recommendation = "";
  PlayListDuration = parseInt(PlayListSize.value);

  switch (TypeOfCalculation.selectedIndex) {
    case 0:
      recommendation = CalculateAmountOfSongs(persona);
      break;

    case 1:
      recommendation = CalculatePlaylistMinutes(persona);
      break;
  }

  let recomendationField = document.querySelector(".recommendationText");
  recomendationField.textContent = recommendation;
  ShowProtopersona(persona);
} //closes CalculateRecommendation method

function CalculateAmountOfSongs(protoPersonaData) {
  let recommendation = "Puedes poner: ";

  for (let i = 0; i < protoPersonaData.length; i++) {
    let mapValueToSongs = parseInt(
      map(protoPersonaData[i], 0, 10, 0, PlayListDuration)
    );
    recommendation +=
      mapValueToSongs + " canciones de " + Database[0][i + 1] + ", ";
  }

  return recommendation;
} //closes CalculateNumberSongs method

function CalculatePlaylistMinutes(protoPersonaData) {
  let recommendation = "Puedes escuchar: ";

  for (let i = 0; i < protoPersonaData.length; i++) {
    let mapValueToMinutes = parseInt(
      map(protoPersonaData[i], 0, 10, 0, PlayListDuration)
    );
    recommendation +=
      mapValueToMinutes + " minutos de " + Database[0][i + 1] + ", ";
  }

  return recommendation;
} //closes CalculatePlaylistMinutes method

function ShowProtopersona(persona) {
  persona.unshift("Protopersona");
  Database[DatabaseOriginalSize] = persona;
  CreateDatabase();
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
