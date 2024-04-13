let isLogin = false;
const loginIcon = document.querySelector(".login_icon");
const popUp = document.querySelector(".pop_up");
const popUpText = popUp.querySelector("p");
const loginIconImg = document.getElementById("login_icon_img");

function checkIsLogin() {
  const isUserLogin = localStorage.getItem("isLogin");
  if (isUserLogin) {
    isLogin = true;
    getYoungest.disabled = false;
    getOldest.disabled = false;
    loginIcon.classList.add("logged_in_user");
    loginIconImg.src = "./resources/login_user_avatar.png";
    app().then();
  }
}

checkIsLogin();

function logIn() {
  isLogin = true;
  getYoungest.disabled = false;
  getOldest.disabled = false;
  localStorage.setItem("isLogin", isLogin);
  loginIcon.classList.add("logged_in_user");
  loginIconImg.src = "./resources/login_user_avatar.png";
  app().then();
}

function logOut() {
  isLogin = false;
  getYoungest.disabled = true;
  getOldest.disabled = true;
  localStorage.clear();
  // currentDB = [];
  loginIcon.classList.remove("logged_in_user");
  loginIconImg.src = "./resources/User_02.svg";
  renderPlaceholder();
}

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
