import { rem } from 'polished';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Grid } from 'styled-css-grid';

import { UserEntity } from '@lib/common/interfaces/user';
import { Avatar, EmojiText } from '@lib/components';
import { getPictureUrl } from '@lib/common/utils/image';
import { Loading } from '@lib/components/Loading';
import { Image } from '@lib/components/Image';
import { A } from '@lib/components/A';
import { theme } from '@lib/common/utils/themes';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { FollowButton } from '@lib/components/Button/FollowButton';
import { useFollower } from '@lib/common/hooks/useFollower';
import { useTranslation } from '@lib/i18n/useTranslation';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: UserEntity;
}

const Wrapper = styled(Grid)`
  width: ${rem('340px')};
  padding: ${rem('20px')} ${rem('24px')};
  padding-bottom: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserBox = styled.div`
  flex: 1;
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

const PreviewBox = styled.div`
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

const UserInfo = styled.div`
  border-top: 1px solid ${theme('colors.gray')};
  padding: ${rem('14px')} ${rem('10px')};
  margin-top: ${rem(16)};
`;

export const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const InfoItem = styled.div`
  padding: 0 ${rem(12)};
`;

export const InfoItemCount = styled.span`
  margin-right: ${rem(8)};
  font-weight: 700;
  font-family: Rubik;
`;

export const InfoItemLabel = styled.span`
  color: ${theme('colors.secondary')};
`;

const UserCard: React.FC<IProps> = ({
  user,
  ...restProps
}) => {
  const { t } = useTranslation();
  const [follow, followLoading] = useFollower();
  const { colors } = useTheme();
  const follower = useCallback(() => user && follow(user), [follow, user]);
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
              <UserName>
                <EmojiText
                  text={user.fullName}
                />
              </UserName>
            </A>
            <Bio>{user.bio}</Bio>
          </UserBox>
          <FollowButton
            size="small"
            disabled={followLoading}
            isFollowing={user.isFollowing}
            onClick={follower}
          />
        </Header>
        <PicturePreview>
          {
            user.pictures.map((picture, index) => (
              <PreviewBox
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
              </PreviewBox>
            ))
          }
        </PicturePreview>
      </Wrapper>
      <UserInfo>
        <Info>
          <InfoItem>
            <InfoItemCount>{user.followerCount}</InfoItemCount>
            <InfoItemLabel>{t('user.label.followers')}</InfoItemLabel>
          </InfoItem>
          <InfoItem>
            <InfoItemCount>{user.followedCount}</InfoItemCount>
            <InfoItemLabel>{t('user.label.followed')}</InfoItemLabel>
          </InfoItem>
          <InfoItem>
            <InfoItemCount>{user.likesCount}</InfoItemCount>
            <InfoItemLabel>{t('user.label.likes')}</InfoItemLabel>
          </InfoItem>
        </Info>
      </UserInfo>
    </div>
  );
};

export default UserCard;
