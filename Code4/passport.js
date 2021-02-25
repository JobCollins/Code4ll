var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//initialize sessions
passport.serializeUser(function(user, done){
    deleteOne(null, user._id);
});

//accept the session
passport.deserializeUser(function(id, done){
    User.findOne({_id: id}, function (err, user) {
        done(err, user)
    })
});

//set the user credentials and check/validate them
passport.use(new LocalStrategy({
    usernameField: 'email'
    },
    function(username, password, done) {
        User.findOne({email:username}, function (err, done) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username or password'
                });
            }
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Incorrect username or password'
                });
            }
            return done(null, user);
        })
    }
));