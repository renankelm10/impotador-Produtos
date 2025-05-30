const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com Supabase
const supabase = createClient(
  'https://dbsxuhwaodchhktzukoy.supabase.co', // <-- Substitua
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRic3h1aHdhb2RjaGhrdHp1a295Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODYyMjQ0NSwiZXhwIjoyMDY0MTk4NDQ1fQ.s2dGnoDeLj1COz1QWmzbYqW5DpgTOt-9Jf2oJEY00OI'                   // <-- Substitua
);

// Login de usuário
app.get('/login', async (req, res) => {
  const { email, senha } = req.query;

  const { data: usuario, error } = await supabase
    .from('cliente')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !usuario) return res.status(404).send('Usuário não encontrado');
  if (usuario.senha !== senha) return res.status(401).send('Senha incorreta');

  res.status(200).send('Acesso liberado');
});

// Cadastro de usuário
app.get('/cadastro', async (req, res) => {
  const { email, senha } = req.query;

  const { error } = await supabase.from('cliente').insert([{ email, senha }]);
  if (error) return res.status(500).send('Erro ao inserir dados');

  res.status(200).send('Dados inseridos com sucesso!');
});

// Inserir produto
app.get('/lista', async (req, res) => {
  const { email, placadocarro, modelo, categoria, detalhes } = req.query;

  const { error } = await supabase.from('produtos').insert([
    { email, placadocarro, modelo, categoria, detalhes },
  ]);
  if (error) return res.status(500).send('Erro ao inserir dados');

  res.status(200).send('Dados inseridos com sucesso!');
});

// Listar produtos
app.get('/dados', async (req, res) => {
  const { data, error } = await supabase.from('produtos').select('*');
  if (error) return res.status(500).send('Erro ao buscar dados');
  res.status(200).json(data);
});

// Excluir produto por ID
app.delete('/excluir/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('produtos').delete().eq('id', id);
  if (error) return res.status(500).send('Erro ao excluir o registro');

  res.status(200).send('Registro excluído com sucesso!');
});

// Buscar empresas
app.get('/empresa', async (req, res) => {
  const { data, error } = await supabase.from('empresa').select('*');
  if (error) return res.status(500).send('Erro ao buscar dados');
  res.status(200).json(data);
});

// Buscar pedidos (se existir a tabela)
app.get('/pedidos', async (req, res) => {
  const { data, error } = await supabase.from('pedidos').select('*');
  if (error) return res.status(500).send('Erro ao buscar dados');
  res.status(200).json(data);
});

// Iniciar servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
