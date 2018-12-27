import { ApolloError } from 'apollo-server';

const known_errors = {
  200: 'OK',
  400: 'bad_request',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
  500: 'internel_server_error',
  503: 'service_unavailable',
};

export class ApiError {
  public status: number;
  public error: any;
  public message: string | null;

  constructor (status: number, message: string | null = null, err: any = null) {
    this.status = status;
    if (err) {
      this.error = err;
    }
    this.message = message;
  }
}
