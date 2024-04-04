const table_cards_content = document.querySelector(".table_content");
const selected_cards_area = document.querySelector(".cards_container");

function clearContent() {
  selected_cards_area.innerHTML = "";
  table_cards_content.innerHTML = "";
}

renderPlaceholder();

async function app() {
  async function fetchDatabase() {
    try {
      const response = await fetch("./resources/DB/db.json");
      const database = await response.json();
      return database;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  const resultDB = await fetchDatabase();
  // const initialSelectedUsers = resultDB.filter((it) => {
  //   return it.isSelected;

  //   if (it.isSelected) {
  //     return true;
  //   }
  // });
  const initialSelectedUsers = resultDB.filter((it) => it.isSelected);

  //initial state for database
  let currentDB = [...resultDB];
  let currentSelectedUsers = [...initialSelectedUsers];

  function volunteersRender(data) {
    clearContent();

    data.forEach((volunteer) => {
      const volunteerCard = createVolunteerCard(volunteer);
      // const selectedVolunteerCard = createSelectedVolunteerCard(volunteer);
      // if (volunteer.isSelected) {
      //   selected_cards_area.appendChild(selectedVolunteerCard);
      //   table_cards_content.appendChild(volunteerCard);
      // } else {
      //   table_cards_content.appendChild(volunteerCard);
      // }
      table_cards_content.appendChild(volunteerCard);
    });
  }

  function selectedUsersRender(data) {
    selected_cards_area.innerHTML = "";

    data.forEach((it) => {
      const selectedVolunteerCard = createSelectedVolunteerCard(it);
      selected_cards_area.appendChild(selectedVolunteerCard);
    });
  }

  function createSelectedVolunteerCard(volunteer) {
    const selectedVolCardDiv = document.createElement("div");
    selectedVolCardDiv.classList.add("card");
    const selectedVolCard = `
    
    <div class="upper_card_info">
    <div class="card_name_info">
    <div class="avatar">
    <img
    src=${volunteer.avatar}
    alt="oops"
    />
    </div>
    <p>${volunteer.firstName} ${volunteer.secondName}</p>
    </div>
    <div class="card_checkbox">
    <input type="checkbox" name="selected02" value="" checked disabled />
    </div>
    </div>
    <div class="lower_card_info">
    <div class="card_address_info">
    <p>Contact information:</p>
    <p class="contact_info_text">${volunteer.phone}</p>
    <p class="contact_info_text">${volunteer.email}</p>
    </div>
    <div class="card_total_donation_info">
    <p>Total donation:</p>
    <p class="total_sum_text">3 000</p>
    </div>
    </div>
    
    `;
    selectedVolCardDiv.insertAdjacentHTML("beforeend", selectedVolCard);

    // selected_cards_area.insertAdjacentHTML("beforeend", selectedVolCard);
    return selectedVolCardDiv;
  }

  function createVolunteerCard(volunteer) {
    const card = document.createElement("div");
    card.classList.add("database_row");

    // We create elements for each field of the volunteer and fill them with data

    const photoDiv = document.createElement("div");
    photoDiv.classList.add("database_item");

    const avatarDiv = document.createElement("div");
    avatarDiv.classList.add("avatar");
    const avatarImg = document.createElement("img");
    avatarImg.src = volunteer.avatar;
    avatarImg.alt = "Volunteer Avatar";
    avatarDiv.appendChild(avatarImg);
    photoDiv.appendChild(avatarDiv);

    const nameDiv = document.createElement("div");
    nameDiv.classList.add("database_item");
    nameDiv.innerHTML = `<p>${volunteer.firstName} ${volunteer.secondName}</p>`;

    const emailDiv = document.createElement("div");
    emailDiv.classList.add("database_item");
    emailDiv.innerHTML = `<p>${volunteer.email}</p>`;

    const addressDiv = document.createElement("div");
    addressDiv.classList.add("database_item");
    addressDiv.innerHTML = `<p>${volunteer.address}</p>`;

    const phoneDiv = document.createElement("div");
    phoneDiv.classList.add("database_item");
    phoneDiv.innerHTML = `<p>${volunteer.phone}</p>`;

    const checkboxDiv = document.createElement("div");
    checkboxDiv.classList.add("database_item", "checkbox_cell");
    const checkboxInput = document.createElement("input");
    checkboxInput.value = "";
    checkboxInput.setAttribute("userId", volunteer.id);
    checkboxInput.setAttribute("type", "checkbox");
    if (volunteer.isSelected) {
      checkboxInput.checked = true;
      card.classList.toggle("card_selected");
    } else {
      checkboxInput.checked = false;
    }

    checkboxInput.addEventListener("change", () => {
      selectUser(volunteer.id);
    });
    checkboxDiv.appendChild(checkboxInput);

    // we add created elements in card
    card.appendChild(photoDiv);
    card.appendChild(nameDiv);
    card.appendChild(emailDiv);
    card.appendChild(addressDiv);
    card.appendChild(phoneDiv);
    card.appendChild(checkboxDiv);

    return card;
  }

  function selectUser(selectedUserId) {
    const newCurrentDB = currentDB.map((it) => {
      if (it.id === selectedUserId && it.isSelected === false) {
        currentSelectedUsers.push(it);
        return {
          ...it,
          isSelected: true,
        };
      }
      if (it.id === selectedUserId && it.isSelected === true) {
        currentSelectedUsers = currentSelectedUsers.filter(
          (item) => item.id !== selectedUserId
        );
        return {
          ...it,
          isSelected: false,
        };
      } else {
        return it;
      }
    });

    //TO DO: set db to local storage

    currentDB = [...newCurrentDB];
    volunteersRender(currentDB);
    selectedUsersRender(currentSelectedUsers);
  }

  //================== FilterByCountries ========================

  function filterUsersbyCity(filterkey) {
    let targetCountry;

    switch (filterkey) {
      case "ua":
        targetCountry = "Ukraine";
        break;
      case "gr":
        targetCountry = "Germany";
        break;
      case "uk":
        targetCountry = "UK";
        break;
      case "pl":
        targetCountry = "Poland";
        break;

      default:
        targetCountry = "Ukraine";
        break;
    }

    if (filterkey !== "all") {
      const filteredUsers = currentDB.filter((item) => {
        return item.country === targetCountry;
      });

      volunteersRender(filteredUsers);
    } else {
      volunteersRender(currentDB);
    }

    // if (filterkey === "ua") {
    //   const filteredUsers = currentDB.filter((item) => {
    //     return item.country === "Ukraine";
    //   });
    //   volunteersRender(filteredUsers);
    // }
  }

  const cities = document.querySelectorAll(".city");
  cities.forEach(function (city) {
    city.addEventListener("click", function () {
      filterUsersbyCity(city.getAttribute("data"));
      cities.forEach(function (it) {
        it.classList.remove("active");
      });
      this.classList.add("active");
    });
  });

  // default render
  volunteersRender(currentDB);
  selectedUsersRender(currentSelectedUsers);
  //
}

function renderPlaceholder() {
  clearContent();
  const cat_placeholder = document.createElement("div");
  cat_placeholder.classList.add("cat_placeholder");
  cat_placeholder.innerHTML = `
                <div class="cat_placeholder_content">
                  <div class="cat_placeholder_animation">
                    
                    <lottie-player
                      src="https://lottie.host/b9bea9ed-25ed-4fa3-beb1-be41f8464380/nJSuZROa9E.json"
                      background="transparent"
                      speed="1"
                      style="width: 250px; height: 250px"
                      direction="1"
                      mode="normal"
                      loop
                      autoplay
                    ></lottie-player>
                  </div>
                  <div class="cat_placeholder_text">
                    <p>Please log in</p>
                  </div>
                </div>
                `;
  table_cards_content.appendChild(cat_placeholder);
}
