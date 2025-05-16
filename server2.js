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
    user: 'sql10779262',
    password: 'w8TbAYSynN',
    database: 'sql10779262',
    port: 3306
  }
});

app.get('/login', async (req, res) => {
  const { email, senha } = req.query;

  try {
    const usuario = await db('cliente').where({ email }).first();

    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }

    if (usuario.senha !== senha) {
      return res.status(401).send('Senha incorreta');
    }

    res.status(200).send('Acesso liberado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao verificar login');
  }
});
app.get('/empresa', async (req, res) => {
  try {
    const rows = await db('empresa').select('*');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar dados');
  }
});



app.get('/cadastro', async (req, res) => {
  const { email, senha } = req.query;

  try {
    await db('cliente').insert({
      email,
      senha,
    });
    res.status(200).send('Dados inseridos com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao inserir dados');
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

app.get('/pedidos', async (req, res) => {
  try {
    const rows = await db('pedidos').select('*');
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
