import * as path from 'path';
console.log(path.resolve(__dirname, '..', 'entities/{*.ts}'));
export default {
  database: {
    type: 'mongodb' as any,
    host: 'localhost',
    database: 'soap',
    logging: ['query', 'error'] as any,
    username: 'soap',
    password: 'soap',
    port: 27017,
	  entities: [path.join(__dirname, '../entities/**/*.ts')],
  },
};
