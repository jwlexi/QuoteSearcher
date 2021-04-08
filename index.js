const express = require("express");
const mysql = require('mysql');
const app = express();
const pool = dbConnection();

app.set("view engine", "ejs");
app.use(express.static("public"));
//routes
app.get("/", async (req, res) => {
    let sql = "SELECT authorId, firstName, lastName FROM q_authors ORDER BY lastName ASC";
    let rows = await executeSQL(sql);
    console.log(rows);
    res.render("index", {"authors":rows});
});

app.get("/authorSearch", async (req, res) => {
    let authorId = req.query.authorId;
    let sql = `SELECT quote FROM q_quotes WHERE authorId = ${authorId} ORDER BY quote ASC`;
    let rows = await executeSQL(sql);
    res.render("results", {"quotes":rows});
}); // search by author route "authorSearch"

app.get("/keywordSearch", async (req, res) => {
    let keyword = req.query.keyword;
    let sql = `SELECT quote FROM q_quotes WHERE quote LIKE "%${keyword}%" ORDER BY quote ASC`;
    let rows = await executeSQL(sql);
    res.render("results", {"quotes":rows});
}); 

//functions
async function executeSQL(sql, params){
return new Promise (function (resolve, reject) {
pool.query(sql, params, function (err, rows, fields) {
if (err) throw err;
   resolve(rows);
});
});
}//executeSQL
//values in red must be updated
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