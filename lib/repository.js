
const fs = require("fs/promises");

class Repository {
  #dir
  constructor(dir) {
    this.#dir = dir;
  }

  async read() {
    let data = await fs.readFile(this.#dir, "utf-8");
    if (data) {
      data = JSON.parse(data);
    } else {
      data = [];
    }
    return data;
  }

  async #write(data) {
    await fs.writeFile(this.#dir, JSON.stringify(data, null, 2));
  }

  async writeNewData(data) {
    const allData = await this.read();
    allData.push(data);
    await this.#write(allData);
  }

  async deleteDataById(id) {
    let data = await this.read();
    const index = data.findIndex(item => item.id === id);
    if (!index >= 0) {
      data.splice(index, 1)
      await this.#write(data)
    } else {
      throw new Error("Data not found");
    }
  }
  
}

module.exports = { Repository };
