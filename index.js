import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db =new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"1Jyotigupta",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];


app.get("/",async (req, res) => {
  const result= await db.query("select * from items");
  res.render("index.ejs", {
    listTitle: "TOday",
    listItems: result.rows
  });
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
  
  
  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
 
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const item= req.body.updatedItemTitle;
  const ids=req.body.updatedItemId;
  await db.query("UPDATE items SET title=$1 WHERE id=$2",[item,ids])
});

app.post("/delete", (req, res) => {
  const ids=req.body.deleteItemId;
  db.query("DELETE FROM items WHERE id=$1",[ids])
  
  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
