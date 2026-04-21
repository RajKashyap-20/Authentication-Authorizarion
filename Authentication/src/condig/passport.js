import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: "",
      clientSecret: "",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const email = profile.emails?.[0]?.value;

          user = await User.findOne({ email });

          if (user) {
            user.googleId = profile.id;
            await user.save();
          } else {
            user = await User.create({
              googleId: profile.id,
              email,
              name: profile.displayName,
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);