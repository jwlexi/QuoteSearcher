// Packages
const express = require("express");
const mysql = require('mysql');


const app = express();
const pool = dbConnection();


// EJS
app.set("view engine", "ejs");
app.use(express.static("public"));


//Routes
app.get("/", async function(req, res) {
  let sql = `SELECT authorId, firstName, lastName FROM q_authors ORDER BY lastName`;
  let sql2 = `SELECT DISTINCT category FROM q_quotes ORDER BY category`
  let rows2 = await executeSQL(sql2);
  let rows = await executeSQL(sql);
  res.render("index", { "authors": rows, "category":rows2 });
});//root

app.get("/searchByAuthor", async function(req, res) {
  let author_id = req.query.authorId;

  let sql = `SELECT quote, firstName, lastName, authorId FROM q_quotes NATURAL JOIN q_authors WHERE authorId = ?`;
  let params = [author_id];
  let rows = await executeSQL(sql, params);

  res.render("results",
    { "quotes": rows});
});//searchByAuthor

app.get("/searchByKeyword", async function(req, res) {
  let keyword = req.query.word;

  let sql = `SELECT quote, firstName, lastName, authorId FROM q_quotes NATURAL JOIN q_authors WHERE quote LIKE ?`;
  let params = [`%${keyword}%`];
  let rows = await executeSQL(sql, params);

  res.render("results",
    { "quotes": rows });
});//searchByKeyword

app.get("/searchByLikes", async function(req, res) {
  let min = req.query.min;
  let max = req.query.max;

  let sql = `SELECT quote, firstName, lastName, authorId FROM q_quotes NATURAL JOIN q_authors WHERE likes BETWEEN ? AND ? ORDER BY quote DESC`;
  let params = [min, max];
  let rows = await executeSQL(sql, params);

  res.render("results",
    { "quotes": rows });
});//searchByLikes

app.get("/searchCategory", async function(req, res) {
    let category = req.query.category;
    let sql = `SELECT quote, firstName, lastName, likes, authorId FROM q_quotes NATURAL JOIN q_authors WHERE category = "${category}" ORDER BY quote`;
    let rows = await executeSQL(sql);
    res.render("results", {"quotes": rows});
});

app.get("/api/getAuthorInfo", async function(req, res) {
  let authorId = req.query.authorId;
  
  let sql = `SELECT * FROM q_authors WHERE authorId = ${authorId}`;
  let rows = await executeSQL(sql);

  res.send(rows);
});//searchByAuthor

app.get("/dbTest", async function(req, res) {
  let sql = "SELECT CURDATE()";
  let rows = await executeSQL(sql);

  res.send(rows);
});//dbTest


//Functions
async function executeSQL(sql, params) {
  return new Promise(function(resolve, reject) {
    pool.query(sql, params, function(err, rows, fields) {
      if (err) throw err;
      resolve(rows);
    });
  });
}//executeSQL

//functions
async function executeSQL(sql, params){
return new Promise (function (resolve, reject) {
pool.query(sql, params, function (err, rows, fields) {
if (err) throw err;
   resolve(rows);
});
});
}//executeSQL
function dbConnection(){

   const pool  = mysql.createPool({

      connectionLimit: 10,
      host: "u6354r3es4optspf.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      user: "e0akqu68iavcjq4j",
      password: "veyekuswbj9hhx3d",
      database: "kvb24o3z5k80pw07"

   }); 

   return pool;

} //dbConnection

//start server
app.listen(3000, () => {
console.log("Expresss server running...")
} )