import { rem } from 'polished';
import React from 'react';
import styled from 'styled-components';
import { Grid } from 'styled-css-grid';

import { UserEntity } from '@lib/common/interfaces/user';
import { Avatar } from '@lib/components';
import { getPictureUrl } from '@lib/common/utils/image';
import { Loading } from '@lib/components/Loading';
import { Image } from '@lib/components/Image';
import { A } from '@lib/components/A';
import { theme } from '@lib/common/utils/themes';
import { useTheme } from '@lib/common/utils/themes/useTheme';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: UserEntity;
}

const Wrapper = styled(Grid)`
  width: ${rem('340px')};
  padding: ${rem('14px')} ${rem('10px')};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const UserBox = styled.div`
  margin-left: ${rem('16px')};
`;

const UserName = styled.p`
  font-size: ${_ => rem(_.theme.fontSizes[3])};
  font-weight: 700;
  margin-bottom: ${rem('2px')};
  color: ${theme('colors.text')};
  text-decoration-color: ${theme('colors.primary')};
`;

const Bio = styled.p`
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  font-weight: 400;
  color: ${theme('colors.secondary')};
`;

const PicturePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-gap: ${rem('6px')};
`;

const PrviewBox = styled.div`
  position: relative;
  padding-bottom: 75%;
  border-radius: 2px;
  overflow: hidden;
`;

const Img = styled(Image)`
  position: absolute;
  width: 100%;
  height: 100%;
  font-family: "object-fit:cover";
  object-fit: cover;
`;

const LoadingBox = styled.div`
  min-width: ${rem('120px')};
  padding: ${rem('24px')};
`;

const UserCard: React.FC<IProps> = ({
  user,
  ...restProps
}) => {
  const { colors } = useTheme();
  if (!user) {
    return (
      <LoadingBox>
        <Loading color={colors.text} size={6} />
      </LoadingBox>
    );
  }
  return (
    <div {...restProps}>
      <Wrapper columns={1} gap="18px">
        <Header>
          <A
            route={`/@${user.username}`}
          >
            <Avatar src={user.avatar} size={48} />
          </A>
          <UserBox>
            <A
              route={`/@${user.username}`}
            >
              <UserName>{user.fullName}</UserName>
            </A>
            <Bio>{user.bio}</Bio>
          </UserBox>
        </Header>
        <PicturePreview>
          {
            user.pictures.map((picture, index) => (
              <PrviewBox
                key={picture.id}
                style={{
                  backgroundColor: picture.color,
                  borderTopLeftRadius: rem(index === 0 ? 4 : 0),
                  borderBottomLeftRadius: rem(index === 0 ? 4 : 0),
                  borderTopRightRadius: rem(index === 2 ? 4 : 0),
                  borderBottomRightRadius: rem(index === 2 ? 4 : 0),
                  overflow: 'hidden',
                }}
              >
                <A
                  route={`/picture/${picture.id}`}
                >
                  <Img src={getPictureUrl(picture.key, 'thumb')} alt="" />
                </A>
              </PrviewBox>
            ))
          }
        </PicturePreview>
      </Wrapper>
    </div>
  );
};

export default UserCard;
