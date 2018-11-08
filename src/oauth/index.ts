import model from './model';
import oauthServer from './oauth';

export default new oauthServer({
  model: new model(),
  accessTokenLifetime: 1000,
  refreshTokenLifetime: 1000,
});
