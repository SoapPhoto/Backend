import { ValidationError } from 'class-validator';

export function formatValidatorClass(errors: any[]) {
  const formatedErrors = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const msg of errors) {
    if (msg as any instanceof ValidationError) {
      const message = Object.values(msg.constraints);
      const err = { param: msg.property, message };
      formatedErrors.push(err);
    }
  }
  return formatedErrors;
}
