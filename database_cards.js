import { volonteers } from "./vol_list.ts";
const db = "./resources/";

const table_cards_content = document.querySelector(".table_content");

console.log(table_cards_content);

function createVolunteerCard(volunteer) {
  const card = document.createElement("div");
  card.classList.add("database_row");

  // Створюємо елементи для кожного поля волонтера та заповнюємо їх даними
  const avatarDiv = document.createElement("div");
  avatarDiv.classList.add("database_item");
  const avatarImg = document.createElement("img");
  avatarImg.src = volunteer.avatar;
  avatarImg.alt = "Volunteer Avatar";
  avatarDiv.appendChild(avatarImg);

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
  checkboxInput.type = "checkbox";
  checkboxInput.name = "available";
  checkboxInput.value = "";
  checkboxDiv.appendChild(checkboxInput);

  // Додаємо створені елементи до картки
  card.appendChild(avatarDiv);
  card.appendChild(nameDiv);
  card.appendChild(emailDiv);
  card.appendChild(addressDiv);
  card.appendChild(phoneDiv);
  card.appendChild(checkboxDiv);

  console.log(volonteers);

  return card;
}

// Проходимось по списку волонтерів та створюємо для кожного картку
volonteers.forEach((volunteer) => {
  const volunteerCard = createVolunteerCard(volunteer);
  table_cards_content.appendChild(volunteerCard);
});
