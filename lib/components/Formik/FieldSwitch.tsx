import { Field, FieldProps } from 'formik';
import React from 'react';

import { Switch, ISwitchProps } from '../Switch';

interface IProps extends Pick<ISwitchProps, 'label' | 'bio'> {
  name: string;
}

const Component = React.memo(({
  field: {
    value, onChange, name, ...restField
  },
  ...restFieldProps
}: FieldProps & IProps) => (
  <Switch
    checked={value}
    {...restField}
    {...restFieldProps}
    onChange={(_, e) => {
      (e!.target as HTMLInputElement).name = name;
      (e!.target as any).value = _;
      onChange(e);
    }}
  />
));

export const FieldSwitch: React.FC<IProps> = ({
  name,
  ...restProps
}) => (
  <Field
    name={name}
    component={Component}
    {...restProps}
  />
);
