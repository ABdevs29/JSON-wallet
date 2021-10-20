//Gobal Variables
const container = document.querySelector(".container");
const input = document.querySelector(".input");
const output = document.querySelector(".output");

//Loading page
function loadPage() {
  input.innerHTML = `<div class="name"><label for="basketName" class="nameLabel"><b>Basket Name:</b></label>
    <input type="text" name="basketName" id="basketName"></div>
    <br>
    <div class="dataEntry"><label for="jsonData"><b>JSON Data:</b></label>
    <textarea name="jsonData" id="jsonData" cols="30" rows="7"></textarea></div>
    <div class="submitButton"><button type="submit" onclick="createBasket()" id="submit">Submit</button>
    <button type="reset" onclick="resetFields()" id="reset">Reset</button></div>`;

  getBaskets();
}

loadPage();

//Get the Baskets stored in Pantry ID
function getBaskets() {
  fetch(
    `https://getpantry.cloud/apiv1/pantry/96e6f109-da0f-40e2-880c-10c0c8bcfaa9`,
    {
      method: "GET",
    })
    .then((data) => {
      return data.json();
    })
    .then((response) => {
      console.log(response);
        for (let i = 0; i < response.baskets.length; i++) {
            const basketName = response.baskets[i];
            console.log(basketName);
            output.innerHTML += `<div class="basket"><h4>Basket ${i + 1}: ${
              response.baskets[i]
            }</h4><button class="btn1" onclick="getBasketDetails('${basketName}','${i}')">Details</button><button class="btn2" onclick="editBasket('${basketName}','${i}')">Edit</button><button class="btn3" onclick="deleteBasket('${basketName}','${i}')">Delete</button><div class="basketDetails${i}"></div><div class="editBasketData${i}"></div></div>`;
          }
    })
    .catch((error) => {
      console.log(error);
    });
}

//Create new baskets
function createBasket() {
  try {
    const ugly = document.querySelector("#jsonData").value;
    let obj = JSON.parse(ugly);
    let pretty = JSON.stringify(obj, undefined, 4);
    document.querySelector("#jsonData").value = pretty;

    const basketName = document.querySelector("#basketName").value;

    fetch(
      `https://getpantry.cloud/apiv1/pantry/96e6f109-da0f-40e2-880c-10c0c8bcfaa9/basket/${basketName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj, undefined, 4),
      }
    )
      .then((response) => refreshContent())
      .catch((error) => {
        console.log(error);
      });
  } catch {
    alert(
      "There is an issue or syntax error with your JSON Data. Kindly check!"
    );
  }
}

//Refresh the content (Baskets)
function refreshContent() {
  output.innerHTML = "";
  getBaskets();
}

function getBasketDetails(basketName, index) {
  console.log(basketName);

  fetch(
    `https://getpantry.cloud/apiv1/pantry/96e6f109-da0f-40e2-880c-10c0c8bcfaa9/basket/${basketName}`,
    {
      method: "GET",
    }
  )
    .then((data) => {
      return data.json();
    })
    .then((response) => {
      console.log(response);
      document.querySelector(`.basketDetails${index}`).innerHTML =
        JSON.stringify(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

//Edit the JSON contents in our baskets
function editBasket(basketName, index) {
  document.querySelector(
    `.editBasketData${index}`
  ).innerHTML = `<textarea name="editJsonData" id="editJsonData" cols="15" rows="7"></textarea>
    <button type="submit" onclick="updateContent('${basketName}', '${index}')">Update</button>
    <button type="submit" onclick="cancelButton('${index}')">Cancel</button>`;
}

//U[date the contents in our Baskets
function updateContent(basketName, index) {
  try {
    const ugly = document.querySelector("#editJsonData").value;
    let obj = JSON.parse(ugly);
    let pretty = JSON.stringify(obj, undefined, 4);
    document.querySelector("#editJsonData").value = pretty;

    fetch(
      `https://getpantry.cloud/apiv1/pantry/96e6f109-da0f-40e2-880c-10c0c8bcfaa9/basket/${basketName}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj, undefined, 4),
      }
    )
      .then((response) => {
        refreshContent();
        document.querySelector(`.editBasketData${index}`).innerHTML = "";
      })
      .catch((error) => {
        console.log(error);
      });
  } catch {
    alert(
      "There is an issue or syntax error with your JSON Data. Kindly check!"
    );
  }
}


//Function for using cancel button
function cancelButton(index) {
  document.querySelector(`.editBasketData${index}`).innerHTML = "";
}

//Delete a basket
function deleteBasket(basketName, index) {
  var r = confirm("Are your sure you want to delete?");

  if (r == true) {
    fetch(
      `https://getpantry.cloud/apiv1/pantry/96e6f109-da0f-40e2-880c-10c0c8bcfaa9/basket/${basketName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((data) => refreshContent())
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log("no changes made...");
  }
}

//Reset Input fields
function resetFields () {
    document.querySelector("#basketName").value = "";
    document.querySelector("#jsonData").value = "";

}
