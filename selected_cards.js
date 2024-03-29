const selected_cards_area = document.querySelector(".cards_container");

volonteers.forEach((it) => {
  if (it.isSelected) {
    const selectedVolCard = `
        <div class="card">
              <div class="upper_card_info">
                <div class="card_name_info">
                  <div class="avatar">
                    <img
                      src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png"
                      alt="oops"
                    />
                  </div>
                  <p>Emma Backwalker</p>
                </div>
                <div class="card_checkbox">
                  <input type="checkbox" name="selected02" value="" />
                </div>
              </div>
              <div class="lower_card_info">
                <div class="card_address_info">
                  <p>Contact information:</p>
                  <p class="contact_info_text">+12123123123</p>
                  <p class="contact_info_text">clapton@gmail.com</p>
                </div>
                <div class="card_total_donation_info">
                  <p>Total donation:</p>
                  <p class="total_sum_text">3 000</p>
                </div>
              </div>
            </div>
        `;

    selected_cards_area.insertAdjacentHTML("beforeend", selectedVolCard);
  }
});

// selectedVol.addEventListener("change", function () {
//   if (this.checked) {
//     selected_cards_area.insertAdjacentHTML("beforeend", selectedVolCard);
//   } else {
//     console.log("Checkbox is unchecked");
//   }
// });
