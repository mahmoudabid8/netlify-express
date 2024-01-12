const express = require('express');
const app = express();
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');
const serverless = require('serverless-http')
const router = express.Router();

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   next();
// });

// app.use(bodyParser.json());

router.get('/', async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'annotations.json');
    const data = await fs.readFile(filePath, 'utf8');
    return res.send(JSON.parse(data));
  } catch (error) {
    console.error('Error reading the file:', error);
  }
});
router.post('/', async (req, res) => {
  try {
    let { point }  = req.body;
    const filePath = path.join(__dirname, 'annotations.json');
    let existingData = await fs.readFile(filePath, 'utf8');
    let data = JSON.parse(existingData)
    data = [...data, point];
    const updatedJSON = JSON.stringify(data, null, 2);
    await fs.writeFile('annotations.json', updatedJSON, 'utf8');
    return res.send({status: "OK"});
  } catch (error) {
    console.error('Error reading the file:', error);
  }
});
app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);