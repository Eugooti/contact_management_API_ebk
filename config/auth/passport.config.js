const Users = require('../../models/PeopleModel/users.model')
const passport = require('passport')
const bcrypt = require("bcrypt");
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Users.findByPk(id,{
            attributes: {exclude: ['password']},
        });
        if (!user) {
            return done(new Error('User not found'));
        }
        done(null, user);

    }catch(err) {
        done(err)
    }
})

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                const user = await Users.findOne({where:{email:username}})

                if (!user) {
                    return done(null,false, {message: 'User not found'})
                }

                const matchPassword = await bcrypt.compare(password, user.password)

                if (!matchPassword) {
                    return done(null, false, {message: 'Wrong username or password'})
                }

                return done(null, user)

            }catch(err) {
                return done(err)
            }
        }
    )
);

module.exports = passport;