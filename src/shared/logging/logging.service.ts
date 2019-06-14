import { Injectable, LoggerService } from '@nestjs/common';
import appRoot from 'app-root-path';
import chalk from 'chalk';
import fs from 'fs';
import moment from 'moment';
import winston from 'winston';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logDir = `${appRoot}/${process.env.LOGGER_DIR}`;

  private readonly logger = winston.createLogger({
    transports: [
      new winston.transports.File({
        level: 'error',
        filename: `${this.logDir}/error.log`,
        handleExceptions: false,
        maxsize: 1024 * 1024 * 10 * 5,
        maxFiles: 5,
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.splat(),
          winston.format.json(),
        ),
      }),
      new winston.transports.File({
        filename: `${this.logDir}/all.log`,
        maxsize: 1024 * 1024 * 10,
        maxFiles: 5,
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.splat(),
          winston.format.json(),
        ),
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
    exceptionHandlers: [
      new winston.transports.File({ filename: `${this.logDir}/exceptions.log` }),
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
