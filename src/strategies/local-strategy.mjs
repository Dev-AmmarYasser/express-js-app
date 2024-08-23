import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(id);
  try {
    const findUser = await User.findById();
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    console.log(`Username: ${username} `);
    console.log(`Password: ${password} `);
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password) throw new Error("Wrong Credentials");
      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
