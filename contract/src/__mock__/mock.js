class User {
  publicKey = "";
  inputs = [];
  response = undefined;
  constructor(publicKey, inputs) {
    this.publicKey = publicKey;
    this.inputs = inputs;
  }
  async send(response) {
    this.response = response;
    return new Promise((resolve) => {
      return response;
    });
  }
}

class Users {
  users = [];
  constructor(users) {
    this.users = users;
  }

  list() {
    return this.users;
  }

  read(input) {
    return input.toString("utf-8");
  }
}

module.exports = {
  User,
  Users,
};
