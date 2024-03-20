let isLogin = false;
localStorage.setItem("isLogin", isLogin);

const cities = document.querySelectorAll(".city");

cities.forEach(function (city) {
  city.addEventListener("click", function () {
    cities.forEach(function (city) {
      city.classList.remove("active");
    });
    this.classList.add("active");
  });
});

const loginIcon = document.querySelector(".login_icon");
const popUp = document.querySelector(".pop_up");

loginIcon.addEventListener("click", () => {
  popUp.classList.toggle("active02");
});

// popUp.addEventListener("click", () => {
//   popUp.classList.remove("active02");
// });

// loginIcon.addEventListener("click", () => {
//   popUp.classList.add("active02");
//   if (!isLogin) {
//     popUp.classList.add("active03");
//     isLogin = true;
//   } else {
//     popUp.classList.add("active04");
//     isLogin = false;
//   }
// });
