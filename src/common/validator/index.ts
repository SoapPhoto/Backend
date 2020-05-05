import { registerDecorator, ValidationArguments, isURL } from 'class-validator';
import { isUserName } from '@common/validator';

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
          return isUserName(value);
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
            return isURL(value);
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
