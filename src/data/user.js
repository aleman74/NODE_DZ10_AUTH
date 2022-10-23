class MyUser {
    constructor(login, pwd) {

        this.login = login;
        this.pwd = pwd;
    }
}
module.exports.MyUser = MyUser;

const users = [];
module.exports.users = users;


module.exports.getUserIndex = (login) => {

      let res = -1;

      for (let i = 0; i < users.length; i++) {
        
        if (users[i].login === login) {
            res = i;
            break;
        }
      }

      return res;
  }
  
  module.exports.verifyPassword = (index, pwd) => {
    return (users[index].pwd === pwd);
  }
  