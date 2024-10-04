import axios from "axios";

export default class UsersService {
  static api = `http://localhost:4000/users`;

  static async getAllUsers() {
    const users = await axios
      .get(`${UsersService.api}/getAll`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.message);
        throw err;
      });

    return users;
  }

  static async createUser(userDetails) {
    const users = await axios
      .post(`${UsersService.api}/create`, userDetails)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.message);
        throw err;
      });

    return users;
  }

  static async deleteUser(id) {
    const users = await axios
      .delete(`${UsersService.api}/delete/${id}`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err.message);
        throw err;
      });

    return users;
  }
}
