
const { v4: uuidv4 } = require("uuid");

class UserEntity {
  constructor(name) {
    if (!name) {
      throw new Error("Name is required");
    }
    this.id = uuidv4()
    this.name = name;
  }
}

module.exports = { UserEntity };
