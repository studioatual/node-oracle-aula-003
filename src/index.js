const express = require("express");
const oracledb = require("oracledb");
const configDatabase = require("./config/database");

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const server = express();
server.use(express.json());

const database = async (req, res, next) => {
  try {
    req.connect = await oracledb.getConnection(configDatabase);
    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ erro: err.message });
  }
};

server.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

server.get("/users", database, async (req, res) => {
  try {
    const response = await req.connect.execute(`SELECT * FROM USERS`);
    return res.json(response.rows);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

server.post("/users", database, async (req, res) => {
  try {
    const { name, email, password, admin } = req.body;
    const query = `INSERT INTO USERS (
        ID, NAME, EMAIL, PASSWORD, ADMIN, CREATED_AT
      ) VALUES (
          (SELECT NVL(MAX(ID), 0) + 1 FROM USERS)
        , :name
        , :email
        , :password
        , :admin
        , LOCALTIMESTAMP
      )`;
    const response = await req.connect.execute(query, {
      name,
      email,
      password,
      admin
    });
    await req.connect.commit();
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

server.get("/users/:id", database, async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM USERS WHERE ID = :id";
    const response = await req.connect.execute(query, { id });
    return res.json(response.rows);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

server.put("/users/:id", database, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, admin } = req.body;
    const query = `UPDATE USERS SET 
        NAME = :name
      , EMAIL = :email
      , PASSWORD = :password
      , ADMIN = :admin 
      , UPDATED_AT = LOCALTIMESTAMP
      WHERE ID = :id`;
    const response = await req.connect.execute(query, {
      id,
      name,
      email,
      password,
      admin
    });
    await req.connect.commit();
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

server.delete("/users/:id", database, async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM USERS WHERE ID = :id";
    const response = await req.connect.execute(query, { id });
    await req.connect.commit();
    return res.json(response);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});

server.listen(3000);
