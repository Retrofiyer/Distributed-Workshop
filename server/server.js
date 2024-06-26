//Call Libraries
const express = require('express');
const fs = require('fs').promises;
const bodyParser = require('body-parser');
const path = require('path');

//Declare constans
const app = express();
const port = 5000;

app.use(bodyParser.json());

//Method to read db.json
const readData = async () => {
   try {
     const data = await fs.readFile(path.join(__dirname, './db/db.json'), 'utf-8');
     return JSON.parse(data);
   } catch (error) {
     console.error('Error reading file:', error);
     return { users: [] };
   }
 };

 //Method Write db.json
 const writeData = async (data) => {
   try {
     await fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(data, null, 2));
   } catch (error) {
     console.error('Error writing file:', error);
   }
 };

 //Endpoint send front client
 app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, './index.html'));
 });

 //Endpoint show users in json format
 app.get('/users', async (req, res) => {
   const usuarios = await readData();
   res.json(usuarios.user);
 });
 
 //Endpoint search users to id
 app.get('/users/:id', async (req, res) => {
   const data = await readData();
   const id = parseInt(req.params.id);
   const user = data.usuario.find((user) => user.id === id);
   if (user) {
     res.json(user);
   } else {
     res.status(404).json({ message: 'User not found' });
   }
 });

 //Endpoint upload new user
 app.post('/usuers', async (req, res) => {
   const data = await readData();
   const body = req.body;
 
   if (!body.firstName || !body.lastName || isNaN(body.age)) {
     return res.status(400).json({ message: 'Fist Name and Last Name is required' });
   }

   // Method create new user
   const newUser = {
     id: data.usuario.length ? Math.max(...data.usuario.map(user => user.id)) + 1 : 1,
     ...body,
   };
   data.usuario.push(newUser);
   await writeData(data);
   res.status(201).json(newUser);
 });

 //Initialize server
 app.listen(port, () => {
    console.log(`Server listening in ${port}...`);
  });