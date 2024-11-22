
function bodyParser(req) {
    return new Promise((resolve) => {
      let data = "";
  
      req.on("data", (chunk) => {
        data += chunk.toString();
      });
  
      req.on("end", () => {
        let body = {};
  
        if (data.length) {
          body = JSON.parse(data)
        }
  
        resolve(body);
      });
    });
  }
  
  module.exports = { bodyParser };
  