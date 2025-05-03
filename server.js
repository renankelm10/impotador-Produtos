const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const keys = require('./glassy-mystery-457920-b6-fa16d11d8cb1.json');

const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const SPREADSHEET_ID = '1VS27hd9YP3Rr8QilF484A3eAOCVHtIFd9NV83xE2PlM';
const RANGE = 'newsletter'; 


app.get('/lista', upload.single('imagem'), async (req, res) => {
  const { email, placadocarro, modelo, categoria, detalhes } = req.query;
  const imagem = req.file ? `http://localhost:5001/uploads/${req.file.filename}` : '';

  try {
    await client.authorize();

    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[email, placadocarro, modelo, categoria, detalhes, imagem]],
      },
    });

    res.status(200).send('Dados enviados com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao enviar dados para a planilha');
  }
});

// Rota para buscar todos os dados
app.get('/dados', async (req, res) => {
  try {
    await client.authorize();

    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (rows.length) {
      res.status(200).json(rows);
    } else {
      res.status(404).send('Nenhum dado encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar dados da planilha');
  }
});


app.listen(5001, () => {
  console.log('Servidor rodando em http://localhost:5001');
});



//1VS27hd9YP3Rr8QilF484A3eAOCVHtIFd9NV83xE2PlM