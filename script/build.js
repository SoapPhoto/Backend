/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config({
  path: '.env.production',
});

const chalk = require('chalk');
const spawn = require('cross-spawn');
const prompts = require('prompts');
const createLogger = require('progress-estimator');
const path = require('path');

const logger = createLogger({
  storagePath: path.join(__dirname, '.progress-estimator'),
});

const onCancel = () => {
  console.log(`${chalk.red('×')} 结束！`);
  process.exit(1);
};

const promptsOptions = { onCancel };

const getBuild = async () => new Promise((resolve) => {
  // console.log(sp);
  const result = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
  result.on('close', (code) => {
    if (code === 0) {
      resolve();
    } else {
      reject();
    }
  })
    .on('error', () => {
      reject();
    });
});

const build = async () => {
  await logger(getBuild(), '打包文件');
  console.log(`${chalk.green('✓')} 打包成功！`);
};

// eslint-disable-next-line consistent-return
const migrate = async () => {
  const { name } = await prompts({
    type: 'text',
    name: 'name',
    message: '请填写迁移名称',
  });
  if (!name) {
    console.log(`${chalk.red('×')} 迁移名称不能为空！`);
    return null;
  }
  const { run } = await prompts({
    type: 'confirm',
    name: 'run',
    message: '是否直接执行迁移文件？',
    initial: true,
  }, promptsOptions);
  const spCreate = async () => new Promise((resolve, reject) => {
    const result = spawn('npm', ['run', 'typeorm:migrate'], { stdio: 'inherit' });
    result
      .on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      })
      .on('error', () => {
        reject();
      });
  });
  const spRun = async () => new Promise((resolve, reject) => {
    const result = spawn('npm', ['run', 'typeorm:run', name], { stdio: 'inherit' });
    result
      .on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject();
        }
      })
      .on('error', () => {
        reject(new Error('Should not emit error'));
      });
  });
  await logger(spCreate(), '生成迁移文件');
  if (run) {
    await logger(spRun(), '执行迁移文件');
  }
  console.log(`${chalk.green('✓')} 迁移成功！`);
};

const main = async () => {
  const { value } = await prompts({
    type: 'select',
    name: 'value',
    message: '请选择功能',
    choices: [
      { title: '打包（build）', description: '打包后端文件', value: 'build' },
      { title: '数据库迁移（migrate）', description: '数据库迁移工作', value: 'migrate' },
    ],
    initial: 0,
  }, promptsOptions);
  if (value === 'migrate') {
    migrate();
  } else {
    build();
  }
};

main();
