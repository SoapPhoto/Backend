import * as React from 'react';
import { Loading, StyleButton } from './styles';

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

type Component = React.FC<IButtonProps>;

export const Button: Component = ({
  children,
  loading = false,
  ...restProps
}) => {
  const loadingRender = (
    <Loading>
      <span />
      <span />
      <span />
    </Loading>
  );
  return (
    <StyleButton
      {...restProps}
      loading={loading}
    >
      <>
        {
          loading && loadingRender
        }
        {children}
      </>
    </StyleButton>
  );
};
