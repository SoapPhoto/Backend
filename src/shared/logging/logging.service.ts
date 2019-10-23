import { Injectable, LoggerService } from '@nestjs/common';
import appRoot from 'app-root-path';
import chalk from 'chalk';
import fs from 'fs';
import dayjs from 'dayjs';
import winston from 'winston';
import WinstonDailyRotate from 'winston-daily-rotate-file';

const LOGGER_COMMON_CONFIG = {
  timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss:SSS'),
  prepend: true,
  datePattern: 'yyyy-MM-dd.',
  maxsize: 1024 * 1024 * 10,
  maxFiles: '31d',
  colorize: false,
  json: false,
  handleExceptions: true,
};

const LOGGER_COMMON_FORMAT = winston.format.combine(
  winston.format.splat(),
  winston.format.printf((info) => {
    const {
      timestamp, level, message, stack,
    } = info;
    const time = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
    return `${time} [${level.toUpperCase()}] ${message} ${stack || ''}`;
  }),
);

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logDir = `${appRoot}/${process.env.LOGGER_DIR}`;

  private readonly logger = winston.createLogger({
    transports: [
      new WinstonDailyRotate({
        level: 'error',
        filename: '%DATE%.log',
        dirname: `${this.logDir}/error/`,
        options: LOGGER_COMMON_CONFIG,
        format: LOGGER_COMMON_FORMAT,
      }),
      // new WinstonDailyRotate({
      //   level: 'warn',
      //   filename: '%DATE%.log',
      //   dirname: `${this.logDir}/warn/`,
      //   options: LOGGER_COMMON_CONFIG,
      //   format: LOGGER_COMMON_FORMAT,
      // }),
      // new WinstonDailyRotate({
      //   level: 'info',
      //   filename: '%DATE%.log',
      //   dirname: `${this.logDir}/normal/`,
      //   options: LOGGER_COMMON_CONFIG,
      //   format: LOGGER_COMMON_FORMAT,
      // }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.splat(),
          winston.format.timestamp(),
          winston.format.printf((info) => {
            const { timestamp, level, message } = info;
            const time = dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
            let newMessage = message;
            if (typeof message === 'object') {
              newMessage = JSON.stringify(message);
            }
            let color = chalk.green;
            switch (level) {
              case 'error':
                color = chalk.red;
                break;
              case 'info':
                color = chalk.blue;
                break;
              default:
                break;
            }
            return `${chalk.green(time)} ${color(`[${level.toUpperCase()}]`)} ${newMessage}`;
          }),
        ),
      }),
    ],
    exitOnError: false,
  });

  constructor() {
    winston.addColors(winston.config.npm.colors);

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  public debug(message: any, context?: string): any {
    this.logger.debug(this.getLogMessage(message, context));
  }

  public error(message: any, trace?: string, context?: string): any {
    this.logger.error(this.getLogMessage(message, context));
  }

  public log(message: any, context?: string): any {
    this.logger.log('info', this.getLogMessage(message, context));
  }

  public verbose(message: any, context?: string): any {
    this.logger.verbose(this.getLogMessage(message, context));
  }

  public warn(message: any, context?: string): any {
    this.logger.warn(this.getLogMessage(message, context));
  }

  private getLogMessage(message: any, context?: string): string {
    return context ? `[${context}]: ${message}` : message;
  }
}

export const Logger = new LoggingService();
