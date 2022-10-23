const module_user = require('../data/user');

// ---------------------------------------------
// Хранение пароля
// ---------------------------------------------
const passport = require('passport');
module.exports = passport;

const LocalStrategy = require('passport-local').Strategy;

// ---------------------------------------------
// Нужно реализовать 3 функции: verify, serializeUser, deserializeUser
// ---------------------------------------------
const verify = (login, pwd, done) => {

    const index = module_user.getUserIndex(login);
    if (index === -1) {
        const error_text = `Error: User '${login}' not found!`;
        done(error_text);
    }
    else if (! module_user.verifyPassword(index, pwd)) {
        const error_text = `Error: Password '${pwd}' is incorrect!`;
        done(error_text);
    }
    else
        done(null, module_user.users[index]);       // Параметры (error, user)
}

passport.serializeUser((user, cb) => {

  cb(null, user.login);   // Параметры (error, id)

});

passport.deserializeUser( (login, cb) => {

    const index = module_user.getUserIndex(login);

    if (index === -1)
        cb(`Error: User '${login}' not found!`);
    else
        cb(null, module_user.users[index]);   // Параметры (error, user)
});


// ---------------------------------------------
// Формируем
// ---------------------------------------------

const options = {
  usernameField: "login",        // Название поля для ввода логина пользователя
  passwordField: "pwd"         // Название поля для ввода пароля пользователя
}

passport.use('local', new LocalStrategy(options, verify));

// ---------------------------------------------

