import { Injectable, LoggerService } from '@nestjs/common';
import appRoot from 'app-root-path';
import chalk from 'chalk';
import fs from 'fs';
import moment from 'moment';
import winston from 'winston';
import winstonDailyRotate from 'winston-daily-rotate-file';

const LOGGER_COMMON_CONFIG = {
  timestamp: moment().format('YYYY-MM-DD HH:mm:ss:SSS'),
  prepend: true,
  datePattern:'yyyy-MM-dd.',
  maxsize: 1024 * 1024 * 10,
  colorize: false,
  json: false,
  handleExceptions: true,
};

const LOGGER_COMMON_FORMAT = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.splat(),
  winston.format.json(),
);

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logDir = `${appRoot}/${process.env.LOGGER_DIR}`;

  private readonly logger = winston.createLogger({
    transports: [
      new winstonDailyRotate({
        level: 'error',
        filename: `${this.logDir}/error.log.txt`,
        options: LOGGER_COMMON_CONFIG,
        format: LOGGER_COMMON_FORMAT,
      }),
      new winstonDailyRotate({
        level: 'warn',
        filename: `${this.logDir}/warn.log.txt`,
        options: LOGGER_COMMON_CONFIG,
        format: LOGGER_COMMON_FORMAT,
      }),
      new winstonDailyRotate({
        level: 'info',
        filename: `${this.logDir}/normal.log.txt`,
        options: LOGGER_COMMON_CONFIG,
        format: LOGGER_COMMON_FORMAT,
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        format: winston.format.combine(
          winston.format.splat(),
          winston.format.timestamp(),
          winston.format.printf((info) => {
            const { timestamp, level, message } = info;
            const time = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
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
            return `${chalk.green(time)} ${color(`[${level}]`)} ${newMessage}`;
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
