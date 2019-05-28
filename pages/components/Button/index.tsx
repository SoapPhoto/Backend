import React from 'react';
import { Loading } from '../Loading';
import { LoadingBox, StyleButton } from './styles';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 加载中
   *
   * @type {boolean}
   * @memberof IButtonProps
   */
  loading?: boolean;
}

type Component = React.FC<IButtonProps>;

export const Button: Component = ({
  children,
  loading = false,
  ...restProps
}) => {
  return (
    <StyleButton
      {...restProps}
      loading={loading}
    >
      <>
        {
          loading && <LoadingBox><Loading /></LoadingBox>
        }
        {children}
      </>
    </StyleButton>
  );
};
