const cities = document.querySelectorAll(".city");

cities.forEach(function (city) {
  city.addEventListener("click", function () {
    cities.forEach(function (city) {
      city.classList.remove("active");
    });
    this.classList.add("active");
  });
});
