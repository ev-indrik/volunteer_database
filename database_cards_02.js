const table_cards_content = document.querySelector(".table_content");

volonteers.forEach((volunteer) => {
  const volunteerCard = `
  <div class="database_row">
                <div class="database_item">
                  <div class="avatar">
                    <img
                      src=${volunteer.avatar}
                      alt="oops"
                    />
                  </div>
                </div>
                <div class="database_item">
                  <p>${volunteer.firstName} ${volunteer.secondName}</p>
                </div>
                <div class="database_item">
                  <p>${volunteer.email}</p>
                </div>
                <div class="database_item">
                  <p>${volunteer.address}</p>
                </div>
                <div class="database_item">
                  <p>${volunteer.phone}</p>
                </div>
                <div class="database_item checkbox_cell">
                  <input type="checkbox" name="available" value="" />
                </div>
              </div>
`;

  table_cards_content.insertAdjacentHTML("beforeend", volunteerCard);
});
