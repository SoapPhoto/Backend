import { rem } from 'polished';
import React from 'react';
import styled from 'styled-components';
import { Grid } from 'styled-css-grid';

import { UserEntity } from '@lib/common/interfaces/user';
import { Avatar } from '@lib/components';
import { getPictureUrl } from '@lib/common/utils/image';
import { Loading } from '@lib/components/Loading';
import { Link } from '@lib/routes';

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
  color: ${_ => _.theme.colors.text};
`;

const Bio = styled.p`
  font-size: ${_ => rem(_.theme.fontSizes[0])};
  font-weight: 400;
  color: ${_ => _.theme.colors.secondary};
`;

const PicturePrview = styled.div`
  display: grid;
  grid-template-columns: repeat(3,1fr);
  grid-gap: ${rem('8px')};
`;

const PrviewBox = styled.div`
  position: relative;
  padding-bottom: 75%;
  border-radius: 2px;
  overflow: hidden;
`;

const Img = styled.img`
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
  if (!user) {
    return (
      <LoadingBox>
        <Loading size={6} />
      </LoadingBox>
    );
  }
  return (
    <div {...restProps}>
      <Wrapper columns={1} gap="18px">
        <Header>
          <Link route={`/@${user.username}`}>
            <a
              href={`/@${user.username}`}
            >
              <Avatar src={user.avatar} size={48} />
            </a>
          </Link>
          <UserBox>
            <Link route={`/@${user.username}`}>
              <a
                href={`/@${user.username}`}
              >
                <UserName>{user.username}</UserName>
              </a>
            </Link>
            <Bio>{user.bio}</Bio>
          </UserBox>
        </Header>
        <PicturePrview>
          {
            user.pictures.map(picture => (
              <PrviewBox key={picture.id} style={{ backgroundColor: picture.color }}>
                <Link route={`/picture/${picture.id}`}>
                  <a
                    href={`/picture/${picture.id}`}
                  >
                    <Img src={getPictureUrl(picture.key, 'thumb')} alt="" />
                  </a>
                </Link>
              </PrviewBox>
            ))
          }
        </PicturePrview>
      </Wrapper>
    </div>
  );
};

export default UserCard;
