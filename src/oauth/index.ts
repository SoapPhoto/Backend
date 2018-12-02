import model from './model';
import oauthServer from './oauth';

export default new oauthServer({
  model: new model(),
  accessTokenLifetime: 3600,
  refreshTokenLifetime: 1209600,
});
