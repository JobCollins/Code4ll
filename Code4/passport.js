var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//initialize sessions
passport.serializeUser(function(user, done){
    done(null, user._id);
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
        User.findOne({email:username}, function (err, user) {
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

passport.use(new GoogleStrategy({
    clientID: '891608981990-jqqcfn6apvrv5b5hj8vhf70gp4h0gs9g.apps.googleusercontent.com',
    clientSecret:'l4cl5TDIiO8qoyBfyFJAihf1',
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    User.findOne({'googleId':profile.id}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, user)
        }
        else{
            User.findOne({email:profile.emails[0].value}, function (err, user) {
                if (user) {
                    user.googleId = profile.id
                    return user.save(function (err) {
                        if (err) {
                            return done(null, false, {message: "Cannot save user info"});
                        }
                        else{
                            return done(null, user)
                        }
                    })
                }
                
                var user = new User();
                user.name = profile.displayName;
                user.email = profile.emails[0].value;
                user.googleId = profile.id;
                user.save(function (err) {
                    if(err) return done(null, false, {message: "Cannot save user info"});
                    return done(null, user);
                });
            })
        }
    })
}
));



