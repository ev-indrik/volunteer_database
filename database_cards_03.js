const table_cards_content = document.querySelector(".table_content");
const selected_cards_area = document.querySelector(".cards_container");

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

  function volunteersRender(resultDB) {
    resultDB.forEach((volunteer) => {
      const volunteerCard = createVolunteerCard(volunteer);
      const selectedVolunteerCard = createSelectedVolunteerCard(volunteer);
      if (volunteer.isSelected) {
        selected_cards_area.appendChild(selectedVolunteerCard);
        table_cards_content.appendChild(volunteerCard);
      } else {
        table_cards_content.appendChild(volunteerCard);
      }
    });
  }

  //   function volunteersRender(resultDB) {
  //     resultDB?.forEach((it) => {
  //       const createdVolCard = createVolunteerCard(it);
  //       table_cards_content.appendChild(createdVolCard);
  //     });
  //   }

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
    <input type="checkbox" name="selected02" value="" />
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

    if (volunteer.isSelected) {
      card.classList.add("card_selected");
    }

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
    checkboxInput.addEventListener("click", () => {
      console.log(volunteer.id);
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

  volunteersRender(resultDB);

  //
}

app().then();
