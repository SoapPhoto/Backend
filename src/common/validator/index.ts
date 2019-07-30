import { registerDecorator, ValidationArguments, Validator } from 'class-validator';

const validator = new Validator();

// tslint:disable-next-line: function-name
export function IsUserName() {
  return (object: object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isUserName',
      target: object.constructor,
      options: {},
      validator: {
        validate(value: any, _: ValidationArguments) {
          return validator.isAlphanumeric(value) && !validator.isNumberString(value);
        },
        defaultMessage(_: ValidationArguments) {
          return 'Text ($value) is no username!';
        },
      },
    });
  };
}

// tslint:disable-next-line: function-name
export function IsWebsite() {
  return (object: object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: 'isWebsite',
      target: object.constructor,
      options: {},
      validator: {
        validate(value: any, _: ValidationArguments) {
          if (value) {
            return validator.isURL(value);
          }
          return true;
        },
        defaultMessage(_: ValidationArguments) {
          return 'Text ($value) is no url!';
        },
      },
    });
  };
}
