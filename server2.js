const express = require('express');
const cors = require('cors');
const knex = require('knex');

const app = express();
app.use(cors());
app.use(express.json());


const db = knex({
  client: 'mysql2',
  connection: {
    host: 'sql10.freesqldatabase.com',
    user: 'sql10776532',
    password: 'UiAn4qPbjp',
    database: 'sql10776532',
    port: 3306
  }
});


app.get('/lista', async (req, res) => {
  const { email, placadocarro, modelo, categoria, detalhes } = req.query;

  try {
    await db('produtos').insert({
      email,
      placadocarro,
      modelo,
      categoria,
      detalhes
    });

    res.status(200).send('Dados inseridos com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao inserir dados');
  }
});


app.get('/dados', async (req, res) => {
  try {
    const rows = await db('produtos').select('*');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar dados');
  }
});


app.delete('/excluir/:id', async (req, res) => {
 const { id } = req.params;

 try {
   const resultado = await db('produtos').where('id', id).del();

   if (resultado) {
     res.status(200).send('Registro excluído com sucesso!');
   } else {
     res.status(404).send('Registro não encontrado');
   }
 } catch (err) {
   console.error(err);
   res.status(500).send('Erro ao excluir o registro');
 }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
