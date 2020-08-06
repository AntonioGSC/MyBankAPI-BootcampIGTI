import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

const router = express.Router();

router.post('/', async (req, res, next) => {
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

    logger.info(`POST /account - ${JSON.stringify(account)}`);
    res.send(account);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const data = await readFile(global.fileName);
    const json = JSON.parse(data);
    delete json.nextID;

    logger.info(`GET /account`);
    res.send(json);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const data = await readFile(global.fileName);
    const json = JSON.parse(data);
    const account = json.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    logger.info(`GET /account/$:id - ${JSON.stringify(account)}`);
    res.send(account);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const data = await readFile(global.fileName);
    const json = JSON.parse(data);
    json.accounts = json.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );
    await writeFile(global.fileName, JSON.stringify(json, null, 2));
    logger.info(`DELETE /account/:id - ${req.params.id}`);
    res.send('Conta Removida com sucesso');
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((a) => a.id === account.id);

    data.accounts[index] = account;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    logger.info(`PUT /account - ${JSON.stringify(account)}`);
    res.send(account);
  } catch (err) {
    next(err);
  }
});

router.patch('/updateBalance', async (req, res, next) => {
  try {
    const account = req.body;
    const data = JSON.parse(await readFile(global.fileName));
    const index = data.accounts.findIndex((a) => a.id === account.id);

    data.accounts[index].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    logger.info(`Patch /account/updateBalance - ${JSON.stringify(account)}`);
    res.send(data.accounts[index]);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} : ${err.message}`);
  res.status(400).send({ error: err.message });
});

export default router;
