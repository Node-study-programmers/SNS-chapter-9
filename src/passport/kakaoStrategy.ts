import passport from 'passport';
import { Strategy } from 'passport-kakao';
import User from '../sequelize/models/User.js';

export default () => {
  passport.use(
    new Strategy(
      {
        clientID: process.env.KAKAO_KEY || '',
        callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'kakao' },
          });
          if (exUser) return done(null, exUser);

          const newUser = await User.create({
            email: null,
            nick: profile.displayName,
            snsId: profile.id,
            provider: 'kakao',
          });
          done(null, newUser);
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
