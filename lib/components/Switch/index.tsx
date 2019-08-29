import React from 'react';
import SwitchCom from 'react-switch';
import { css } from 'styled-components';
import { rem } from 'polished';
import { theme } from '@lib/common/utils/themes';

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

export const Switch: React.FC<ISwitchProps> = ({ label, bio, ...props }) => {
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
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: ${() => rem('12px')};
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
          `}
        >
          <p
            css={css`
              font-size: ${_ => rem(theme('fontSizes[1]')(_))};
              color: ${theme('colors.text')};
              margin: 0;
            `}
          >
            {label}
          </p>
          {
            bio && (
              <p
                css={css`
                  font-size: ${_ => rem(_.theme.fontSizes[0])};
                  color: ${theme('colors.secondary')};
                  margin-top: ${rem(12)};
                `}
              >
                {bio}
              </p>
            )
          }
        </div>
        {Child}
      </div>
    );
  }
  return Child;
};
