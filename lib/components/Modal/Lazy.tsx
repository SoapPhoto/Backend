import React from 'react';

interface IProp extends React.HTMLAttributes<HTMLDivElement> {
  hiddenClassName?: string;
  visible: boolean;
}

export const Lazy: React.FC<IProp> = ({
  visible,
  children,
  hiddenClassName,
  className = '',
  ...restProp
}) => {
  let useClassName = className;
  if (!!hiddenClassName && !visible) {
    useClassName += ` ${hiddenClassName}`;
  }
  return (
    <div className={useClassName} {...restProp}>
      {children}
    </div>
  );
};
