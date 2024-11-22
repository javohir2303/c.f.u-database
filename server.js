
const http = require("node:http");
const url = require("node:url");
const { ResData } = require("./lib/resData");
const { Repository } = require("./lib/repository");
const path = require("node:path");
const { bodyParser } = require("./lib/bodyParser");
const { Fruits } = require("./lib/fruits");
const { CategoryEntity } = require("./lib/categoryEntity");
const { UserEntity } = require("./lib/userEntity")

const fruitsDir = path.join(__dirname, "database", "fruits.json");
const categoriesDir = path.join(__dirname, "database", "categories.json");
const userDir = path.join(__dirname, "database", "users.json");

const fruitsRepo = new Repository(fruitsDir);
const categoriesRepo = new Repository(categoriesDir);
const userRepo = new Repository(userDir);

async function handleRequest(req, res) {
  const method = req.method;
  const parsedUrl = url.parse(req.url).pathname.split("/");

  if (method === "GET" && parsedUrl[1] === "fruit") {
    const fruits = await fruitsRepo.read();
    const resData = new ResData(200, "success", fruits);
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));

  } else if (method === "POST" && parsedUrl[1] === "fruit") {
    const body = await bodyParser(req);

    if (!body.name || !body.count || !body.price) {
      const resData = new ResData(400, "Please provide name, count, and price");
      res.writeHead(resData.statusCode);
      return res.end(JSON.stringify(resData));
    }

    const newFruit = new Fruits(body.name, body.count, body.price);
    await fruitsRepo.writeNewData(newFruit);

    const resData = new ResData(201, "created", newFruit);
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));

  } else if (method === "DELETE" && parsedUrl[1] === "fruit" && parsedUrl[2]) {
    const id = parsedUrl[2];
    try {
      await fruitsRepo.deleteDataById(id);
      const resData = new ResData(200, "Fruit deleted successfully");
      res.writeHead(resData.statusCode);
      res.end(JSON.stringify(resData));
    } catch (error) {
      const resData = new ResData(404, error.message);
      res.writeHead(resData.statusCode);
      res.end(JSON.stringify(resData));
    }

  } else if (method === "GET" && parsedUrl[1] === "category") {
    const categories = await categoriesRepo.read();
    const resData = new ResData(200, "success", categories);
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));

  } else if (method === "POST" && parsedUrl[1] === "category") {
    const body = await bodyParser(req);

    if (!body.name) {
      const resData = new ResData(400, "Please provide category name");
      res.writeHead(resData.statusCode);
      return res.end(JSON.stringify(resData));
    }

    const newCategory = new CategoryEntity(body.name);
    await categoriesRepo.writeNewData(newCategory);

    const resData = new ResData(201, "created", newCategory);
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));

  } else if (method === "DELETE" && parsedUrl[1] === "category" && parsedUrl[2]) {
    const id = parsedUrl[2];
    try {
      await categoriesRepo.deleteDataById(id);
      const resData = new ResData(200, "Category deleted successfully");
      res.writeHead(resData.statusCode);
      res.end(JSON.stringify(resData));
    } catch (error) {
      const resData = new ResData(404, error.message);
      res.writeHead(resData.statusCode);
      res.end(JSON.stringify(resData));
    }

} else if (method === "GET" && parsedUrl[1] === "user") {
  const users = await userRepo.read();
  const resData = new ResData(200, "success", users);
  res.writeHead(resData.statusCode);
  res.end(JSON.stringify(resData));
} else if (method === "POST" && parsedUrl[1] === "user") {
    const body = await bodyParser(req);
  
    if (!body.name) {
      const resData = new ResData(400, "Please provide a name");
      res.writeHead(resData.statusCode);
      return res.end(JSON.stringify(resData));
    }
  
    const newUser = new UserEntity(body.name)
    await userRepo.writeNewData(newUser)
  
    const resData = new ResData(201, "created", newUser);
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));
  } else if (method === "DELETE" && parsedUrl[1] === "user" && parsedUrl[2]) {
    const id = parsedUrl[2]
    await userRepo.deleteDataById(id)
  
    const resData = new ResData(200, "User deleted successfully");
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));
  }   else {
    const resData = new ResData(404, "This API does not exist");
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));
  }
}


const server = http.createServer(handleRequest);

server.listen(7777, () => {
  console.log("Server is running at http://localhost:7777");
});
