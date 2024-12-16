const express = require('express');
const { google } = require('googleapis');
const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static('public')); // Serve static files from the 'public' directory

const SPREADSHEET_ID = '1GMIq1X234k00POpYZ90r5h4szDFkFk0BY50DKNv9mgA';
const RANGE = 'Projects!A2:I'; // Extended range to include date and complexity
const PORT = 3000;
const DEBUG = false;

// Initialize Google Sheets API
async function initGoogleSheetsAPI() {
  let keyFile = 'credentials.json';
  if (DEBUG == false){
    keyFile = '/etc/secrets/' + keyFile;
  }
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFile,
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

app.get('/', (req, res) => { 
  res.sendFile('index.html', {root: __dirname}); 
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