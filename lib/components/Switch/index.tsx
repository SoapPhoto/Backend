import React from 'react';
import SwitchCom from 'react-switch';
import { FieldItem } from '../Formik/FieldItem';

export interface ISwitchProps {
  checked: boolean;
  label?: string;
  bio?: string;
  onChange: (
    checked: boolean,
    event?: React.SyntheticEvent<MouseEvent | KeyboardEvent> | MouseEvent,
    id?: string
  ) => void;
}

export const Switch: React.FC<ISwitchProps> = ({
  label, bio, ...props
}) => {
  const Child = (
    <SwitchCom
      onColor="#05f"
      onHandleColor="#fff"
      handleDiameter={18}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="none"
      activeBoxShadow="none"
      height={22}
      width={40}
      {...props}
    />
  );
  if (label) {
    return (
      <FieldItem label={label} bio={bio}>
        {Child}
      </FieldItem>
    );
  }
  return Child;
};
