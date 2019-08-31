import React from 'react';
import { Loading } from '../Loading';
import { LoadingBox, StyleButton } from './styles';

export * from './LikeButton';
export * from './IconButton';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 加载中
   *
   * @type {boolean}
   * @memberof IButtonProps
   */
  loading?: boolean;
  danger?: boolean;
  text?: boolean;
}

type Component = React.FC<IButtonProps>;

export const Button: Component = ({
  children,
  loading = false,
  danger,
  text,
  ...restProps
}) => (
  <StyleButton
    {...restProps}
    text={text ? 1 : 0}
    danger={danger ? 1 : 0}
    loading={loading ? 1 : 0}
  >
    <>
      {
        loading && <LoadingBox><Loading /></LoadingBox>
      }
      {children}
    </>
  </StyleButton>
);
