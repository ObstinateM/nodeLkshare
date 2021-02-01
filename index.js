const express = require('express');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

/*   Database Part   */

const mysql = require('mysql');

const db = mysql.createConnection({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : 'lkshare',
  port : '8889',
  socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock'
});

db.connect((err) => {
  if(err) throw(err);
  console.log('MySQL connect ON');
})

/*   Web Part   */

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));

// Home
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
  res.redirect(`/${req.body.url}`);
});

// Page avec url
app.get('/:url', (req, res) => {
  let sql = `SELECT * FROM lk WHERE url = '${req.params.url}'`;
  let query = db.query(sql, (err, result) => {
    if(err) throw err;
    try {
      let string = JSON.stringify(result);
      let jsonResult = JSON.parse(string);
      let contenu = jsonResult[0].content;
      res.render('lk', {inputVar: contenu,
                        motcle: req.params.url
      });
    } catch (error) {
      let contenu = '';
      res.render('lk', {inputVar: contenu,
                        motcle: req.params.url
      });
    };
  });
});

app.post('/:url', (req, res) => {
  let sql = `SELECT COUNT(url) as total FROM lk WHERE url = '${req.params.url}'`;
  let query = db.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result[0].total == 0);
    if(result[0].total == 0){ // LA CONDITION A FIX
      let add = {url:req.params.url, content:req.body.content};
      let sql = `INSERT INTO lk SET ?`;
      let query = db.query(sql, add, (err, result) => {
        if(err) throw err;
        res.redirect(`/${req.params.url}`);
      });
    } else {
      let sql = `UPDATE lk SET content = '${req.body.content}' WHERE url = '${req.params.url}'`;
      let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.redirect(`/${req.params.url}`);
      });
    };
  });
  //${req.body.content}
});

// Server Start
app.listen(3000, () => {
    console.log('Server started...');
});
