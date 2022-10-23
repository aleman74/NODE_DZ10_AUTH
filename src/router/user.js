const module_user = require('../data/user');

const express = require('express');
const router = express.Router();
module.exports = router;

const my_pwd = require('../middle/my_pwd');

// Авторизация
router.get('/login', (req, res) => {

    const error_text = req.session.last_error;       // Описание последней ошибки
    req.session.last_error = '';

    console.log('req.session.last_url =', req.session.last_url);


    res.render('login', {error_text});
});

router.get('/login/ok', (req, res) => {

    console.log('login OK');
    console.log('req.session.last_url =', req.session.last_url);

    if (req.session.last_url)
    {
        const v = req.session.last_url;
        req.session.last_url = '';

        res.redirect(v);
    }
    else
        res.redirect('/api/user/me');
});

router.post('/login', 
    my_pwd.authenticate('local', { successRedirect: '/api/user/login/ok' }),    // { failureRedirect: '/api/user/login', successRedirect: '/api/user/me' }
    (err, req, res, next) => {
        // При возникновении ошибки добавляется первый параметр err, если ошибки нет, то передаётся только три параметра req, res, next.
        // Чтобы отработать ошибку авторизации здесь, обязательно нужно указать параметр next

        // Необходимо указывать параметер next , иначе после неудачной авторизации код ниже не будет выполнен
//        if (err) 
//            next(err);

        if (err)
        {
            console.log('Отрабатываем ошибку');

            req.session.last_error = 'Ошибка во время авторизации: ' + err;
            res.redirect('/api/user/login/');
        }
        else
        {
            // Этот код не отрабатывает, при удачной авторизации автоматический переход на successRedirect
            console.log('Отрабатываем успех');

            if (req.session.last_url)
                res.redirect(req.session.last_url);
            else
                res.redirect('/api/user/me');
        }
});

// Профиль
router.get('/me',
    
    (req, res, next) => {

//        if (req.user == null)
        if (! req.isAuthenticated())
        {
            req.session.last_url = '/api/user/me';
            res.redirect('/api/user/login');
        }
        else
            next();    // Переход на следующий обработчик
    },
    (req, res) => {
        res.render('me', { user: req.user });
    }
);

// Регистрация
router.get('/signup', (req, res) => {

    const error_text = req.session.last_error;       // Описание последней ошибки
    req.session.last_error = '';

    res.render('signup', {error_text});
});

router.post('/signup', 
    (req, res) => {

        const {login, pwd} = req.body;

        if (module_user.getUserIndex(login) > -1)
        {
            req.session.last_error = `Ошибка во время регистрации: Пользователь "${login}" уже существует!`;
            res.redirect('/api/user/signup');
        }
        else
        {
            // Добавляем пользователя
            let v = new module_user.MyUser(login, pwd);
            module_user.users.push(v);

            res.render('login', {error_text: ''});
        }
            
});