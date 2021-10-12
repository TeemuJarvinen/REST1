const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const fs = require("fs");
const path = require("path");

// Setting static folder
app.use(express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/dictionary", (req, res) => {
  res.json(readFile());
});

// Get a translation to the Finnish word
app.get("/api/dictionary/:word", (req, res) => {
  let dictionary = readFile();
  let correctWord = [];
  let wordFount = false;
  dictionary.forEach((element) => {
    let words = element.split(" ");
    if (words[0] == req.params.word) {
      correctWord = words[1];
      wordFount = true;
    }
  });
  if (wordFount) {
    res.json(correctWord);
  } else {
    res.status(400).json(`Unknown word - ${req.params.word}`);
  }
});

// Create a new translation to the Finnish word
app.post("/api/dictionary", (req, res) => {
  // How to add in postman || Lisäys postmanissa muotoa
  // {
  //   "Finnish": "Posti",
  //   "English": "Mail"
  // }

  const newTranslation = {
    Finnish: req.body.Finnish,
    English: req.body.English,
  };

  if (!newTranslation.Finnish || !newTranslation.English) {
    return res
      .status(400)
      .json("Please include Finnish word and it's English translation");
  }

  finnishWord = newTranslation["Finnish"];
  englishTranslation = newTranslation["English"];

  fs.appendFileSync("dictionary.txt", `\n${finnishWord} ${englishTranslation}`);
  res.json(readFile());
});

// ------------------- Functions --------------------
let readFile = () => {
  const data = fs.readFileSync("./dictionary.txt", {
    encoding: "utf8",
    flag: "r",
  });

  dataSplit = data.split("\n");
  return dataSplit;
};

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
