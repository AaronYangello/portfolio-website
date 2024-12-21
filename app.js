const express = require('express');
const { google } = require('googleapis');
const ejs = require('ejs');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if ('OPTIONS' == req.method) {
       res.sendStatus(200);
     }
     else {
       next();
     }});

app.set('view engine', 'ejs');
app.set('views', './views');

const SPREADSHEET_ID = '1GMIq1X234k00POpYZ90r5h4szDFkFk0BY50DKNv9mgA';
const RANGE = 'Projects!A2:I'; // Extended range to include date and complexity
const PORT = 3000;

// Initialize Google Sheets API
async function initGoogleSheetsAPI() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_API_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const client = await auth.getClient();
  google.options({ auth: client });
  return google.sheets('v4');
}

// Load projects from Google Sheets
async function loadProjects() {
  try {
    const gsapi = await initGoogleSheetsAPI();
    const response = await gsapi.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });
    return response.data.values;
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

app.get('/', async (req, res) => { 
  const projectsData = await loadProjects();
  const base_url = process.env.BASE_URL;
  res.render('index', {root: __dirname, base_url:base_url, projects: JSON.stringify(projectsData[0])}); 
});

// Endpoint to serve projects data
app.get('/projects', async (req, res) => {
  try {
    const projectsData = await loadProjects();
    res.json(projectsData);
  } catch (error) {
    console.error('Error serving projects:', error);
    res.status(500).json({ message: 'Failed to load projects' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});