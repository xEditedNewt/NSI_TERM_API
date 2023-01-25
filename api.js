const sqlite3 = require('sqlite3')
const express = require("express");
const app = express();
const cors = require('cors');
const lien_api = '/api/v1'

let db = new sqlite3.Database('data.sqlite', err => {
    if (err) throw err
    console.log('data base "data.sqlite" bien active')
  })
set_api()
async function set_api(){
  db.run('CREATE TABLE IF NOT EXISTS user_data(id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, email VARCHAR, mdp VARCHAR, token VARCHAR)')
    app.use(cors())
    app.get(`${lien_api}/email/:email`,async (req,res) =>{
      db.all('SELECT * FROM user_data WHERE email = ?', [req.params.email], async (err, data) => {
        if(data.length == 0){
            res.json({
                message: " "
            })
        }
        else{
          res.json({
            message: "L'email est déjà utilisé pour un autre compte."
        })
        }
      })
  })
  app.get(`${lien_api}/verification/`,async (req,res) =>{
    const userData = req.headers;
    if (!userData.mdp || !userData.email) {
      return res.status(400).send({
        message: 'Erreur 404'
      });
    }
    db.all('SELECT * FROM user_data WHERE email = ?', [userData.email], async (err, data) => {
      console.log(data)
      if(data.length == 0){
          res.json({
              message: "L'email n'existe pas, veuillez vous créer un compte"
          })
      }
      else{
        if(data[0].mdp == userData.mdp){
          res.json({
            message: " ",
            email: data[0].email,
            mdp: data[0].mdp,
            token: data[0].token,
            id: data[0].id
        })
        }
        else{
          res.json({
            message: "Mdp incorrect"
        })
        }
      }
    })
  })
  app.post(`${lien_api}/creation/`, cors(),(req, res) => {
    const userData = req.headers;
    if (!userData.mdp || !userData.email) {
      return res.status(400).send({
        message: 'Les données fournies sont incorrectes.'
      });
    }
    const token = Array(30)
    .fill(null)
    .map(() => Math.random().toString(36)[2])
    .join('');
    db.all('SELECT * FROM user_data WHERE email = ?', [userData.email], async (err, data) => {
      if(data.length == 0){
        db.run('INSERT INTO user_data(name,email,mdp,token) VALUES(?,?,?,?)', [userData.name,userData.email,userData.mdp, token]);
        db.all('SELECT * FROM user_data WHERE email = ?', [userData.email], async (err, data) => {
          console.log(data)
          id = data[0].id
        res.json({
          message:"Compte créer avec succès",
          token : token,
          email: userData.email,
          name: userData.name,
          id: id
        })
          db.run('CREATE TABLE IF NOT EXISTS conversations(id_conv INTEGER PRIMARY KEY AUTOINCREMENT, userC VARCHAR, emailC VARCHAR, userR VARCHAR, emailR VARCHAR)')
          db.run('CREATE TABLE IF NOT EXISTS conversations' + data[0].id + '(idConv INTEGER, user VARCHAR, email VARCHAR, lastMessage VARCHAR)')
        })
      }
      else{
          res.json({
            message: "Un compte est déjà enregistrer sur cette adresse mail"
        })
      }
    })
    });
    app.post(`${lien_api}/new-conv/`, cors(),(req, res) => {
      const userData = req.headers;
      if (!userData.id || !userData.emailR || !userData.nameR) {
        return res.status(400).send({
          message: 'Les données fournies sont incorrectes.'
        });
      }
      db.all('SELECT * FROM conversations' + userData.id + ' WHERE email = ?', [userData.email], async (err, data) => {
        if(data.length == 0){
          db.all('SELECT * FROM user_data WHERE id = ?', [userData.id], async (err, data1) => {
            db.run('INSERT INTO conversations(userC, emailC, userR, emailR)',[data1[0].name,data1[0].email,userData.name,userData.email])
            db.all('SELECT * FROM conversations WHERE userC = ? AND emailC = ? AND userR = ? AND emailR = ?', [data1[0].name, data1[0].email, userData.name, userData.email], function(err, data2){
              db.run('INSERT INTO conversations' + userData.id + '(idConv,user,email,lastMessage) VALUES(?,?,?)', [data2[0].id_conv,userData.name,userData.email,"Aucun message"]);
              db.all('SELECT * FROM user_data WHERE email = ?', [userData.email], function(err, data3){
                db.run('INSERT INTO conversations' + data3[0].id + '(idConv,user,email,lastMessage) VALUES(?,?,?)', [data2[0].id_conv,data1[0].name,data1[0].email,"Aucun message"]);
                res.json({
                  message:" ",
                })
              })
            })
          })
        }
        else{
            res.json({
              message: "Une conversation existe déjà avec cette personne"
          })
        }
      })
      });
    app.get(`${lien_api}/conversations/`,async (req,res) =>{
      console.log("/conversations/")
      const userData = req.headers;
      console.log(userData)
      if (!userData.id ) {
        return res.status(400).send({
          message: 'Erreur 404'
        });
      }
      db.all('SELECT * FROM conversations' + userData.id, async (err, data) => {
        console.log(data)
        if(data.length == 0){
          console.log("aucune conv")
          res.json({
            message: 'Vous avez aucun conversation pour le moment.'
          })
        } else {
          console.log("test")
          res.json({
            message:'t',
            data: data
          })
        }
      })
    })

    app.get(`${lien_api}/compte/`,async (req,res) =>{
      console.log("/compte/")
      db.all('SELECT email,name,mdp FROM user_data', async (err, data) => {
        console.log(data)
          res.json({
            data:data,
          })
      })
    })
}


app.listen(80,() => console.log('listening on port 80'))
