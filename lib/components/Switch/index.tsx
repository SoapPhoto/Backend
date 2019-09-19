import React from 'react';
import SwitchCom from 'react-switch';
import styled from 'styled-components';
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

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${() => rem('12px')};
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Label = styled.p`
  font-size: ${_ => rem(theme('fontSizes[1]')(_))};
  color: ${theme('colors.text')};
  margin: 0;
`;
const Bio = styled.p`
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  color: ${theme('colors.secondary')};
  margin-top: ${rem(4)};
`;
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
      <Content>
        <Box>
          <Label>
            {label}
          </Label>
          {
            bio && (
              <Bio>
                {bio}
              </Bio>
            )
          }
        </Box>
        {Child}
      </Content>
    );
  }
  return Child;
};
