import * as path from 'path';
console.log(path.resolve(__dirname, '..', 'entities/{*.ts}'));
export default {
  database: {
    type: 'mysql' as any,
    host: 'localhost',
    database: 'soap',
    logging: ['query', 'error'] as any,
    username: 'root',
    password: 'hufeiyu123',
    port: 3306,
    charset: 'utf8mb4_general_ci',
    entities: [path.join(__dirname, '../entities/**/*.ts')],
  },
  qn: {
    bucket: 'soap',
    accessKey: 's7VsqN9lIEMdpA1yIlpMx3xdw-HabAJ8va3c61xs',
    secretKey: 'X68gki8PWV1dO81sCimPU80uL8Mc2chHSfdb6-RM',
  },
};
