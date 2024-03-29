const table_cards_content = document.querySelector(".table_content");

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
  console.log(resultDB);
}

app().then();
