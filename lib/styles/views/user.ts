import { rem } from 'polished';
import styled from 'styled-components';

import { href } from '@lib/common/utils/themes/common';
import { Edit } from '@lib/icon';

export const Wrapper = styled.div``;

export const UserHeader = styled.div`
  max-width: ${rem('700px')};
  width: 100%;
  margin: 64px auto;
  padding: 0 ${rem('20px')};
`;

export const UserName = styled.h2`
  font-family: Rubik;
  font-size: ${_ => rem(_.theme.fontSizes[5])};
  margin-top: ${rem('6px')};
  margin-bottom: ${rem('12px')};
`;

export const Profile = styled.div`
  display: flex;
  margin-bottom: ${rem('4px')};
`;

export const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: ${rem('8px')};
  margin-right: ${rem('24px')};
  min-width: 0;
  font-family: Rubik;
  color: ${_ => _.theme.colors.secondary};
  & svg {
    margin-right: ${rem('4px')};
  }
`;

export const ProfileItemLink = styled.a`
  display: flex;
  align-items: center;
  ${_ => href(_.theme.colors.secondary)}
`;

export const Bio = styled.p`
  font-size: ${_ => rem(_.theme.fontSizes[1])};
  font-family: Rubik;
`;

export const EditIcon = styled(Edit)`
  margin-left: ${rem('24px')};
  stroke: ${_ => _.theme.colors.secondary};
`;