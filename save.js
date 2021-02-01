// Ajouter dans la DB
app.get('/add', (req, res) => {
    let add = {url:'test', content:'Just writing some shitty text right here.'};
    let sql = 'INSERT INTO lk SET ?';
    let query = db.query(sql, add, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send('TEST ADDED');
    });
  });
  
  // Ajouter dans la DB
  app.get('/get', (req, res) => {
    let sql = 'SELECT * FROM lk';
    let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send('Post Get');
    });
  });
  
  // Avoir UN post
  app.get('/getposts/:url', (req, res) => {
    let sql = `SELECT * FROM lk WHERE url = '${req.params.url}'`;
    let query = db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send(`Post with ${req.params.urlpo} fetched`);
    });
  });
  
  // Update
  app.get('/update/:id', (req, res) => {
    let newContent = 'New text in here';
    let sql = `UPDATE lk SET content = '${newContent}' WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send(`Post updated`);
    });
  });
  