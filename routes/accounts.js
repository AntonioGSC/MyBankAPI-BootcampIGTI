import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let account = req.body;
    const data = await readFile(global.fileName);
    const json = JSON.parse(data);

    account = {
      id: json.nextID++,
      ...account,
    };

    json.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(json, null, 2));

    res.send(account);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await readFile(global.fileName);
    const json = JSON.parse(data);
    delete json.nextID;
    res.send(json);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await readFile(global.fileName);
    const json = JSON.parse(data);
    const account = json.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    res.send(account);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await readFile(global.fileName);
    const json = JSON.parse(data);
    json.accounts = json.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );
    await writeFile(global.fileName, JSON.stringify(json, null, 2));
    res.send('Conta Removida com sucesso');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((a) => a.id === account.id);

    data.accounts[index] = account;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(account);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.patch('/updateBalance', async (req, res) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((a) => a.id === account.id);

    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    res.send(data.accounts[index]);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
