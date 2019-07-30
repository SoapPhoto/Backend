import { Field, FieldProps } from 'formik';
import React from 'react';

import { IInputProps, Input } from '../Input';

interface IProps extends IInputProps {
  name: string;
}

const Component = React.memo(({
  field,
  form: { touched, errors },
  ...restFieldProps
}: FieldProps & IProps) => {
  const error = touched[field.name] ? errors[field.name] as string : undefined;
  return (
    <Input {...field} {...restFieldProps} error={error} />
  );
});

export const FieldInput: React.FC<IProps> = ({
  name,
  ...restProps
}) => (
  <Field
    name={name}
    component={Component}
    {...restProps}
  />
);
