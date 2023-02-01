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
    console.log("verification")
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
              message: "Cette email n existe pas, veuillez vous créer un compte"
          })
      }
      else{
        if(data[0].mdp == userData.mdp){
          res.json({
            message: " ",
            email: data[0].email,
            mdp: data[0].mdp,
            token: data[0].token,
            id: data[0].id,
            name: data[0].name
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
    console.log("creation")
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
      console.log("new-conv")
      const userData = req.headers;
      if (!userData.id || !userData.emailr) {
        return res.status(400).send({
          message: 'Les données fournies sont incorrectes.'
        });
      }
      db.all('SELECT * FROM conversations' + userData.id + ' WHERE email = ?', [userData.emailr], async (err, data) => {
        if(data.length == 0){
          db.all('SELECT * FROM user_data WHERE id = ?', [userData.id], async (err, data1) => {
            db.all('SELECT * FROM user_data WHERE email = ?', [userData.emailr], function(err, data3){
              namer = data3[0].name
              id = data3[0].id
              db.run('INSERT INTO conversations(userC, emailC, userR, emailR) VALUES(?,?,?,?)',[data1[0].name,data1[0].email,namer,userData.emailr])
              db.all('SELECT * FROM conversations WHERE userC = ? AND emailC = ? AND userR = ? AND emailR = ?', [data1[0].name, data1[0].email, namer, userData.emailr], function(err, data2){
                db.run('INSERT INTO conversations' + userData.id + '(idConv,user,email,lastMessage) VALUES(?,?,?,?)', [data2[0].id_conv,namer,userData.emailr,"Aucun message"]);
                db.all('SELECT * FROM user_data WHERE email = ?', [userData.email], function(err, data3){
                  db.run('INSERT INTO conversations' + id + '(idConv,user,email,lastMessage) VALUES(?,?,?,?)', [data2[0].id_conv,data1[0].name,data1[0].email,"Aucun message"]);
                  db.run('CREATE TABLE IF NOT EXISTS conversations_' + data2[0].id_conv + '(email VARCHAR, user VARCHAR, createdDate VARCHAR ,message VARCHAR)')
                  res.json({
                   message:' ',
                   id:data2[0].id_conv
                  })
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


      app.post(`${lien_api}/new-message/`, cors(),(req, res) => {
        console.log("new-message")
        const userData = req.headers;
        if (!userData.id || !userData.id_conv || !userData.message) {
          return res.status(400).send({
            message: 'Les données fournies sont incorrectes.'
          });
        }
        db.all('SELECT * FROM conversations WHERE id_conv = ?', [userData.id_conv], async (err, data) => {
          console.log(data)
          if(data.length == 1){
            db.all('SELECT * FROM user_data WHERE id = ?', userData.id,async (err, data1) => {
              if(data[0].emailC== data1[0].email){
                db.all('SELECT * FROM user_data WHERE email = ?', data[0].emailR,async (err, data2) => {
                  db.run('UPDATE conversations' + data2[0].id + ' SET lastMessage = ? WHERE idConv = ? ',[userData.message,userData.id_conv])
                  db.run('INSERT INTO conversations_' + userData.id_conv + '(email, user, createdDate, message) VALUES(?,?,?,?)',[data1[0].email,data1[0].name, await getDateFormatted(), userData.message])
                })
              }
              else{
                db.all('SELECT * FROM user_data WHERE email = ?', data[0].emailC,async (err, data2) => {
                  db.run('UPDATE conversations' + data2[0].id + ' SET lastMessage = ? WHERE idConv = ? ',[userData.message,userData.id_conv])
                  db.run('INSERT INTO conversations_' + userData.id_conv + '(email, user, createdDate, message) VALUES(?,?,?,?)',[data1[0].email,data1[0].name, await getDateFormatted(), userData.message])
                })
              }
              res.json({
                message: "succes"
            })
            })
          }
          else{
              res.json({
                message: "Erreur",
                data:[]
            })
          }
        })
      });



    app.get(`${lien_api}/conversations/`,async (req,res) =>{
      console.log("conversations")
      const userData = req.headers;
      if (!userData.id ) {
        return res.status(400).send({
          message: 'Erreur 404'
        });
      }
      db.all('SELECT * FROM user_data WHERE id= ?',[userData.id], async (err, data1) => {
        console.log(data1)
        db.all('SELECT * FROM conversations WHERE emailC = ? OR emailR = ?',[data1[0].email,data1[0].email], async (err, data) => {
          if(data.length == 0){
            res.json({
              message: 'Vous avez aucun conversation pour le moment.'
            })
          } else {
            db.all('SELECT * FROM conversations' + userData.id, async (err, data) => {
              if(data.length == 0){
                res.json({
                  message: 'Vous avez aucun conversation pour le moment.'
                })
              } else {
                res.json({
                  message:' ',
                  data: data
                })
              }
            })
          }
        })
      })
    })


    app.get(`${lien_api}/messages/`,async (req,res) =>{
      console.log("messages")
      const userData = req.headers;
      if (!userData.id_conv) {
        return res.status(400).send({
          message: 'Erreur 404'
        });
      }
      db.all('SELECT * FROM conversations_' + userData.id_conv, async (err, data) => {
        if(data.length == 0){
          res.json({
            data:[]
          })
        } else {
          res.json({
            message:' ',
            data: data
          })
        }
      })
    })


    app.get(`${lien_api}/conversation/`,async (req,res) =>{
      console.log("conversation")
      const userData = req.headers;
      if (!userData.id_conv || !userData.id ) {
        return res.status(400).send({
          message: 'Erreur 404'
        });
      }
      db.all('SELECT * FROM conversations' + userData.id + ' WHERE idConv = ?',[userData.id_conv], async (err, data) => {
        if(data.length == 0){
          res.json({
            message: 'Aucune conversation'
          })
        } else {
          res.json({
            message:'Conversation avec ' + data[0].user
          })
        }
      })
    })


    app.get(`${lien_api}/compte/`,async (req,res) =>{
      console.log("compte")
      db.all('SELECT email,name,mdp FROM user_data', async (err, data) => {
        console.log(data)
          res.json({
            data:data,
          })
      })
    })
    
    app.post(`${lien_api}/new-mdp/`, cors(),(req, res) => {
      console.log("new-mdp")
      const userData = req.headers;
      if (!userData.id || !userData.mdp || !userData.new_mdp) {
        return res.status(400).send({
          message: 'Les données fournies sont incorrectes.'
        });
      }
      else{
        db.all('SELECT * FROM user_data WHERE id = ? AND mdp = ? ', [userData.id,userData.mdp], async (err, data) => {
          if(data.length == 0){
           res.json({
            message : "Une erreur c'est produite, veuillez re tenter"
           })
          }
          else{
            db.run('UPDATE user_data SET mdp = ? WHERE id = ?  AND mdp = ?',[userData.new_mdp,userData.id,userData.mdp])
            let newMdp = userData.new_mdp;
            let mask = '';
            for (let i = 0; i < newMdp.length; i++) {
            if (i < newMdp.length / 2) {
            mask += '*';
          } else {
            mask += newMdp[i];
          }
          }
            res.json({
              message:"Votre message a été modifier en " + newMdp
            })
          }
        })
      }
    });

}

app.listen(5000,() => console.log('listening on port 5000'))

function getDateFormatted() {
  var now = new Date();
  var hour = (now.getHours() < 10 ? "0" + now.getHours() : now.getHours())
  var minutes = (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes())
  var secondes = (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds())
  return hour + "h-" + minutes + "m-" + secondes + "s";
}