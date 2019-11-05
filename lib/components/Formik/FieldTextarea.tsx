import { Field, FieldProps } from 'formik';
import React from 'react';

import { Textarea, ITextareaProps } from '../Input';

interface IProps extends ITextareaProps {
  name: string;
}

const Component = React.memo(({
  field,
  form: { touched, errors },
  ...restFieldProps
}: FieldProps & IProps) => {
  const error = touched[field.name] ? errors[field.name] as string : undefined;
  return (
    <Textarea {...field} {...restFieldProps} error={error} />
  );
});

export const FieldTextarea: React.FC<IProps> = ({
  name,
  ...restProps
}) => (
  <Field
    name={name}
    component={Component}
    {...restProps}
  />
);
