const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryId = repositories.findIndex(repository => 
    repository.id === id
  );

  if (findRepositoryId === -1) {
    response.status(400).json({ error: 'Repository does not exist' });
  } 

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepositoryId].likes,
  }

  repositories[findRepositoryId] = repository
    
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const findRepositoryId = repositories.findIndex(repository => 
    repository.id === id
  );

  if (findRepositoryId >= 0) {
    repositories.splice(findRepositoryId, 1);
  } else {
    response.status(400).json({ error: 'Repository does not exist' })
  }

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepositoryId = repositories.findIndex(repository => 
    repository.id === id
  );

  if (findRepositoryId === -1) {
    response.status(400).json({ error: 'Repository does not exist' });
  } 

  repositories[findRepositoryId].likes++;

  return response.json(repositories[findRepositoryId]);
});

module.exports = app;
