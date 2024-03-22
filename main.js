let isLogin = false;
const loginIcon = document.querySelector(".login_icon");
const popUp = document.querySelector(".pop_up");
const popUpText = popUp.querySelector("p");
const loginIconImg = document.getElementById("login_icon_img");

localStorage.setItem("isLogin", isLogin);

function logIn() {
  isLogin = true;
  loginIcon.classList.add("logged_in_user");
  loginIconImg.src = "./resources/user_logged.jpg";
}

function logOut() {
  isLogin = false;
  loginIcon.classList.remove("logged_in_user");
  loginIconImg.src = "./resources/User_02.svg";
}

const cities = document.querySelectorAll(".city");
cities.forEach(function (city) {
  city.addEventListener("click", function () {
    cities.forEach(function (city) {
      city.classList.remove("active");
    });
    this.classList.add("active");
  });
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

popUp.addEventListener("click", () => {
  if (!isLogin) {
    logIn();
  } else {
    logOut();
  }
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
