// ===== main div-es for cards rendering

const table_cards_content = document.querySelector(".table_content");
const selected_cards_area = document.querySelector(".cards_container");

// side checkboxes
const femaleCheckbox = document.getElementById("option2");
const driveCheckbox = document.getElementById("option3");
const doctorCheckbox = document.getElementById("option4");
const animalRescueCheckbox = document.getElementById("option5");
const veterinarianCheckbox = document.getElementById("option6");
const psychologyCheckbox = document.getElementById("option7");
const availableCheckbox = document.getElementById("option8");

//=====Total amounts in footer
const total_filtered_quantity = document.getElementById("total_filtered");
const total_vol_quantity = document.getElementById("list_total_vol");
const total_selected_quantity = document.getElementById("list_selected_vol");

//=====Yungest and oldest buttons
const getYoungest = document.querySelector(".youngest_btn");
const getOldest = document.querySelector(".oldest_btn");

//buttom TotalDonations

const totalDonationBtn = document.querySelector(".button_total_donations");
const totalDonationResultBtn = document.querySelector(
  ".total_donations_result"
);

let transformFiltersToString;

function clearContent() {
  selected_cards_area.innerHTML = "";
  table_cards_content.innerHTML = "";
}

function clearMainDbContent() {
  table_cards_content.innerHTML = "";
}

//======cat page========

renderPlaceholder();

class ModalforAgeBt {
  constructor(modalTitle) {
    this.modalTitle = modalTitle;
  }

  render(minAgeObject) {
    const cover = document.createElement("div");
    cover.classList.add("modal-cover", "active");

    cover.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal-cover")) {
        this.hide();
      }
    });

    const modalBody = document.createElement("form");
    modalBody.classList.add("modal-body");
    const title = document.createElement("h2");
    title.innerText = this.modalTitle;
    modalBody.appendChild(title);
    const closeBtn = document.createElement("div");
    closeBtn.classList.add("modalClose");
    const closeBtnImage = document.createElement("img");
    closeBtnImage.src = "./resources/Close_MD.svg";
    closeBtn.appendChild(closeBtnImage);

    closeBtn.addEventListener("click", (e) => this.hide());

    modalBody.innerHTML = `
      <div class="upper_card_info">
        <div class="card_name_info">
          <div class="avatar">
            <img src="${minAgeObject.avatar}" alt="oops" />
          </div>
          <p>${minAgeObject.firstName} ${minAgeObject.secondName}</p>
          <p>Age: ${minAgeObject.age}</p>
        </div>
       </div>
      <div class="lower_card_info">
        <div class="card_address_info">
        <div class="card_address_info_content">
        <p>Contact information:</p>
          <p class="contact_info_text">${minAgeObject.phone}</p>
          <p class="contact_info_text">${minAgeObject.email}</p>
        </div> 
        </div>
        <div class="card_total_donation_info">
          <p>Total donation:</p>
          <p class="total_sum_text">3 000</p>
        </div>
      </div>
    `;

    modalBody.appendChild(closeBtn);
    cover.appendChild(modalBody);
    document.body.appendChild(cover);
  }

  hide() {
    const cover = document.querySelector(".modal-cover");
    cover.remove();
  }
}

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
  const initialSelectedUsers = resultDB.filter((it) => it.isSelected);

  //initial state for database
  let currentDB = [...resultDB];
  let currentSelectedUsers = [...initialSelectedUsers];

  function getTotalDonationsAmount(arr) {
    return arr.reduce(
      (totalSum, volunteer) =>
        totalSum +
        volunteer.donation.reduce((acc, donation) => acc + donation.amount, 0),
      0
    );
  }

  totalDonationBtn.addEventListener("click", () => {
    const totalDonations = getTotalDonationsAmount(currentDB);
    totalDonationResultBtn.innerText =
      getTotalDonationsAmount(currentDB).toLocaleString();
  });

  volunteersRender();

  //

  let filtersStateArray = [];

  function getFilteredDB(filteredCountryKey) {
    if (filteredCountryKey !== "all") {
      return currentDB.filter((it) => it.country === filteredCountryKey);
    } else {
      return currentDB;
    }
  }

  // ==== youngest and oldest

  // modal

  const callModal = new ModalforAgeBt("Youngest User");
  const oldestUserModal = new ModalforAgeBt("Oldest User");

  //young and old logic

  getYoungest.addEventListener("click", () => {
    const minAgeObject = currentDB.reduce((min, volunteer) => {
      return volunteer.age < min.age ? volunteer : min;
    }, currentDB[0]);

    callModal.render(minAgeObject);
  });

  const initialButtonText = "Get the oldest volunteer";

  const findOldestVolunteer = () => {
    const maxAgeObject = currentDB.reduce((max, volunteer) => {
      return volunteer.age > max.age ? volunteer : max;
    }, currentDB[0]);

    getOldest.innerText = `The most experienced volonteer: ${maxAgeObject.firstName} ${maxAgeObject.secondName}, age ${maxAgeObject.age}`;
  };

  getOldest.addEventListener("click", () => {
    if (getOldest.innerText !== initialButtonText) {
      getOldest.innerText = initialButtonText;
    } else {
      findOldestVolunteer();
    }
    oldestUserModal.render();
  });

  //=================Filters operations

  femaleCheckbox.addEventListener("change", (e) => {
    const checkboxFilter = {
      id: "femaleCheckbox",
      key: "sex",
      value: "female",
    };

    const isChecked = filtersStateArray.find(
      (it) => it.id === "femaleCheckbox"
    );

    if (isChecked) {
      filtersStateArray = filtersStateArray.filter(
        (it) => it.id !== "femaleCheckbox"
      );
    } else {
      filtersStateArray.push(checkboxFilter);
    }

    transformFiltersToString = filtersStateArray
      .map((item) => {
        if (typeof item.value === "boolean") {
          return `it.${item.key} === ${item.value}`;
        } else {
          return `it.${item.key} === "${item.value}"`;
        }
      })
      .join(" && ");

    volunteersRender();
  });

  //==========

  driveCheckbox.addEventListener("change", (e) => {
    const checkboxFilter = {
      id: "driveCheckbox",
      key: "isHasDriverLicence",
      value: true,
    };

    const isChecked = filtersStateArray.find((it) => it.id === "driveCheckbox");

    if (isChecked) {
      filtersStateArray = filtersStateArray.filter(
        (it) => it.id !== "driveCheckbox"
      );
    } else {
      filtersStateArray.push(checkboxFilter);
    }

    transformFiltersToString = filtersStateArray
      .map((item) => {
        if (typeof item.value === "boolean") {
          return `it.${item.key} === ${item.value}`;
        } else {
          return `it.${item.key} === "${item.value}"`;
        }
      })
      .join(" && ");

    volunteersRender();
  });

  //
  doctorCheckbox.addEventListener("change", (e) => {
    const checkboxFilter = {
      id: "doctorCheckbox",
      key: "isHasMedicalExperience",
      value: true,
    };

    const isChecked = filtersStateArray.find(
      (it) => it.id === "doctorCheckbox"
    );

    if (isChecked) {
      filtersStateArray = filtersStateArray.filter(
        (it) => it.id !== "doctorCheckbox"
      );
    } else {
      filtersStateArray.push(checkboxFilter);
    }

    transformFiltersToString = filtersStateArray
      .map((item) => {
        if (typeof item.value === "boolean") {
          return `it.${item.key} === ${item.value}`;
        } else {
          return `it.${item.key} === "${item.value}"`;
        }
      })
      .join(" && ");

    volunteersRender();
  });

  //
  animalRescueCheckbox.addEventListener("change", (e) => {
    const checkboxFilter = {
      id: "animalRescueCheckbox",
      key: "isHasAnimalRescueExperience",
      value: true,
    };

    const isChecked = filtersStateArray.find(
      (it) => it.id === "animalRescueCheckbox"
    );

    if (isChecked) {
      filtersStateArray = filtersStateArray.filter(
        (it) => it.id !== "animalRescueCheckbox"
      );
    } else {
      filtersStateArray.push(checkboxFilter);
    }

    transformFiltersToString = filtersStateArray
      .map((item) => {
        if (typeof item.value === "boolean") {
          return `it.${item.key} === ${item.value}`;
        } else {
          return `it.${item.key} === "${item.value}"`;
        }
      })
      .join(" && ");

    volunteersRender();
  });

  //
  veterinarianCheckbox.addEventListener("change", (e) => {
    const checkboxFilter = {
      id: "veterinarianCheckbox",
      key: "isHasVetExperience",
      value: true,
    };

    const isChecked = filtersStateArray.find(
      (it) => it.id === "veterinarianCheckbox"
    );

    if (isChecked) {
      filtersStateArray = filtersStateArray.filter(
        (it) => it.id !== "veterinarianCheckbox"
      );
    } else {
      filtersStateArray.push(checkboxFilter);
    }

    transformFiltersToString = filtersStateArray
      .map((item) => {
        if (typeof item.value === "boolean") {
          return `it.${item.key} === ${item.value}`;
        } else {
          return `it.${item.key} === "${item.value}"`;
        }
      })
      .join(" && ");

    volunteersRender();
  });

  //
  psychologyCheckbox.addEventListener("change", (e) => {
    const checkboxFilter = {
      id: "psychologyCheckbox",
      key: "isHasPsychologicalExperience",
      value: true,
    };

    const isChecked = filtersStateArray.find(
      (it) => it.id === "psychologyCheckbox"
    );

    if (isChecked) {
      filtersStateArray = filtersStateArray.filter(
        (it) => it.id !== "psychologyCheckbox"
      );
    } else {
      filtersStateArray.push(checkboxFilter);
    }

    transformFiltersToString = filtersStateArray
      .map((item) => {
        if (typeof item.value === "boolean") {
          return `it.${item.key} === ${item.value}`;
        } else {
          return `it.${item.key} === "${item.value}"`;
        }
      })
      .join(" && ");

    volunteersRender();
  });

  //
  availableCheckbox.addEventListener("change", (e) => {
    const checkboxFilter = {
      id: "availableCheckbox",
      key: "isAvailable",
      value: true,
    };

    const isChecked = filtersStateArray.find(
      (it) => it.id === "availableCheckbox"
    );

    if (isChecked) {
      filtersStateArray = filtersStateArray.filter(
        (it) => it.id !== "availableCheckbox"
      );
    } else {
      filtersStateArray.push(checkboxFilter);
    }

    transformFiltersToString = filtersStateArray
      .map((item) => {
        if (typeof item.value === "boolean") {
          return `it.${item.key} === ${item.value}`;
        } else {
          return `it.${item.key} === "${item.value}"`;
        }
      })
      .join(" && ");

    volunteersRender();
  });

  //=====================Rendering

  function volunteersRender() {
    clearMainDbContent();

    const filteredDB = currentDB.filter((it) => {
      if (transformFiltersToString) {
        return eval(transformFiltersToString);
      } else {
        return it;
      }
    });

    filteredDB.forEach((volunteer) => {
      const volunteerCard = createVolunteerCard(volunteer);
      table_cards_content.appendChild(volunteerCard);
    });

    total_filtered_quantity.innerText = filteredDB.length;
    total_vol_quantity.innerText = resultDB.length;
    total_selected_quantity.innerText = currentSelectedUsers.length;
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
    volunteersRender();
    selectedUsersRender(currentSelectedUsers);
  }

  //===============Creating arrays for filters with already selected users

  function createDBforFilters(firstDB, selectedUsersDB) {
    const selectedUsersIds = selectedUsersDB.map((it) => it.id);

    const result = firstDB.filter((it) => {
      return !selectedUsersIds.includes(it.id);
    });
    return [...result, ...selectedUsersDB];
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
        targetCountry = "all";
        break;
    }

    // filteredCountry = targetCountry;

    const checkboxFilter = {
      id: "countryCheckbox",
      key: "country",
      value: targetCountry,
    };

    filtersStateArray = filtersStateArray.filter(
      (it) => it.id !== "countryCheckbox"
    );

    if (targetCountry !== "all") {
      filtersStateArray.push(checkboxFilter);
    }

    transformFiltersToString = filtersStateArray
      .map((item) => {
        if (typeof item.value === "boolean") {
          return `it.${item.key} === ${item.value}`;
        } else {
          return `it.${item.key} === "${item.value}"`;
        }
      })
      .join(" && ");

    volunteersRender();
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
  volunteersRender();
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
