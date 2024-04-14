// log in & log out logic
let isLogin = false;
const loginIcon = document.querySelector(".login_icon");
const popUp = document.querySelector(".pop_up");
const popUpText = popUp.querySelector("p");
const loginIconImg = document.getElementById("login_icon_img");

// ===== main div-es for cards rendering

const table_cards_content = document.querySelector(".table_content");
const selected_cards_area = document.querySelector(".cards_container");

// ===== Input for searching by name
const searchInput = document.getElementById("search-input");
const searchReset = document.querySelector(".clear-text");

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

//button TotalDonations

const totalDonationBtn = document.querySelector(".button_total_donations");
const totalDonationResultBtn = document.querySelector(
  ".total_donations_result"
);
const totalDonationWindow = document.querySelector(".total_donations_window");

let transformFiltersToString;

function clearContent() {
  selected_cards_area.innerHTML = "";
  table_cards_content.innerHTML = "";
}

function clearMainDbContent() {
  table_cards_content.innerHTML = "";
}

//===MODAL

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

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal_container");
    const closeBtn = document.createElement("div");
    closeBtn.classList.add("modalClose");
    const closeBtnImage = document.createElement("img");
    closeBtnImage.src = "./resources/modal_close_icon.svg";
    closeBtn.appendChild(closeBtnImage);

    closeBtn.addEventListener("click", (e) => this.hide());

    modalBody.innerHTML = `
        <div class="modal_header">

          <div class="image_wrapper">
            <img src="${
              minAgeObject?.avatar ? minAgeObject?.avatar : ""
            }" alt="photo" />
          </div>
          <div class="name_box">
          <div class="modal_title">${this.modalTitle}</div>
            <h2>${minAgeObject.firstName} ${minAgeObject.secondName}</h2>
          </div>
        </div>

        <div class="modal_main">
          <div class="main_personal_data_container">
            <div class="personal_data_title">
              <h3>Personal data</h3>
            </div>
            <div class="personal_data_table">
              <div class="personal_age modal_table">
                <span>Age:</span>
                <span>${minAgeObject.age}</span>
              </div>
              <div class="personal_email modal_table">
                <span>email:</span>
                <span>${minAgeObject.email}</span>
              </div>
              <div class="personal_address modal_table">
                <span>Address:</span>
                <span>${minAgeObject.address}</span>
              </div>
              <div class="personal_country modal_table">
                <span>Country:</span>
                <span>${minAgeObject.country}</span>
              </div>
              <div class="personal_driving_license modal_table">
                <span>Driving license:</span>
                <span>${minAgeObject.isHasDriverLicence}</span>
              </div>
              <div class="personal_vet_experience modal_table">
                <span>Vet experience:</span>
                <span>${minAgeObject.isHasVetExperience}</span>
              </div>
              <div class="personal_another_pr modal_table">
                <span>Additional info:</span>
                <span>TBC</span>
              </div>
            </div>
          </div>

           <div class="donation_info_container">
            <div class="donation_info_title">
              <h3>Donations</h3>
            </div>
            ${minAgeObject.donation
              .map(
                (donation) => `
              <div class="donation_info_table modal_table">
                <span>${donation.date}:</span>
                <span>${donation.amount.toLocaleString()}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="modal_footer">
          <div class="footer_buttons_container">
            <button class="ft_button ft_button_edit">Edit</button>
            <button class="ft_button ft_button_close">Close</button>
          </div>
        </div>
    `;

    const closeButton = modalBody.querySelector(".ft_button_close");
    closeButton.addEventListener("click", () => {
      this.hide();
    });

    modalBody.addEventListener("submit", (e) => e.preventDefault());

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
  let resultDB = [];
  let currentDB = [];
  let currentSelectedUsers = [];
  let filtersStateArray = [];

  if (isLogin) {
    resultDB = await fetchDatabase();
    currentDB = [...resultDB];
    const initialSelectedUsers = resultDB.filter((it) => it.isSelected);
    currentSelectedUsers = [...initialSelectedUsers];
  } else {
    resultDB = [];
    currentDB = [];
    currentSelectedUsers = [];
    filtersStateArray = [];
  }

  // Searching by name

  function searchUsers(searchText) {
    const searchedUsers = resultDB.filter((it) => {
      return (
        it.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        it.secondName.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    return searchedUsers;
  }

  let typingTimer; // Timer identifier
  const doneTypingInterval = 1000;

  searchInput.addEventListener("input", () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      const searchResjult = searchUsers(searchInput.value);
      currentDB = [...searchResjult];
      volunteersRender();
    }, doneTypingInterval);
  });

  searchReset.addEventListener("click", () => {
    searchInput.value = "";
    transformFiltersToString = "";
    currentDB = resultDB;
    volunteersRender();
  });

  //======Total amount

  function getTotalDonationsAmount(arr) {
    return arr.reduce(
      (totalSum, volunteer) =>
        totalSum +
        volunteer.donation.reduce((acc, donation) => acc + donation.amount, 0),
      0
    );
  }

  totalDonationBtn.addEventListener("click", () => {
    totalDonationBtn.classList.add("clicked");
    totalDonationWindow.classList.add("clicked02");
    totalDonationResultBtn.innerText =
      getTotalDonationsAmount(currentDB).toLocaleString();
    setTimeout(() => {
      totalDonationBtn.classList.remove("clicked");
      totalDonationWindow.classList.remove("clicked02");
    }, 3000);
  });

  // ==== youngest and oldest

  // modal

  const youngestModal = new ModalforAgeBt("Youngest User:");
  const oldestModal = new ModalforAgeBt("Oldest User:");
  const volunteerClicked = new ModalforAgeBt("Volunteer");

  //young, old logic

  getYoungest.addEventListener("click", () => {
    const minAgeObject = currentDB.reduce((min, volunteer) => {
      return volunteer.age < min.age ? volunteer : min;
    }, currentDB[0]);

    youngestModal.render(minAgeObject);
  });

  getOldest.addEventListener("click", () => {
    const maxAgeObject = currentDB.reduce((max, volunteer) => {
      return volunteer.age > max.age ? volunteer : max;
    }, currentDB[0]);

    oldestModal.render(maxAgeObject);
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

  function clearFooterStatictics() {
    total_filtered_quantity.innerText = 0;
    total_vol_quantity.innerText = 0;
    total_selected_quantity.innerText = 0;
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

    avatarDiv.addEventListener("click", () => {
      volunteerClicked.render(volunteer);
    });

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
    } else {
      searchInput.value = "";
      transformFiltersToString = "";
      currentDB = resultDB;
      volunteersRender();
    }
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

  if (isLogin) {
    volunteersRender();
    selectedUsersRender(currentSelectedUsers);
  } else {
    clearFooterStatictics();
    renderPlaceholder();
  }
  //
}
//============= APP END ===============

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

// ======= log in & log out functions======

function checkIsLogin() {
  const isUserLogin = localStorage.getItem("isLogin");
  if (isUserLogin) {
    isLogin = true;
    getYoungest.disabled = false;
    getOldest.disabled = false;
    loginIcon.classList.add("logged_in_user");
    loginIconImg.src = "./resources/login_user_avatar.png";
  }
  app();
}

function logIn() {
  isLogin = true;
  localStorage.setItem("isLogin", isLogin);
  getYoungest.disabled = false;
  getOldest.disabled = false;
  loginIcon.classList.add("logged_in_user");
  loginIconImg.src = "./resources/login_user_avatar.png";
  app().then();
}

function logOut() {
  isLogin = false;
  localStorage.clear();
  getYoungest.disabled = true;
  getOldest.disabled = true;
  loginIcon.classList.remove("logged_in_user");
  loginIconImg.src = "./resources/User_02.svg";
  app();
}

popUp.addEventListener("click", () => {
  if (!isLogin) {
    logIn();
  } else {
    logOut();
  }
});

loginIcon.addEventListener("click", (e) => {
  e.stopPropagation();
  popUp.classList.toggle("active02");
  if (!isLogin) {
    popUpText.innerText = "Log in";
  } else {
    popUpText.innerText = "Log out";
  }
});

checkIsLogin();
