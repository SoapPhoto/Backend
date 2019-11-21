import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';

import { WrapperBox, box } from '@lib/common/utils/themes/common';
import { Button } from '@lib/components/Button';
import { withAuth } from '@lib/components/router/withAuth';
import { pageWithTranslation } from '@lib/i18n/pageWithTranslation';
import { I18nNamespace } from '@lib/i18n/Namespace';
import { useAccountStore } from '@lib/stores/hooks';
import Toast from '@lib/components/Toast';
import { SEO } from '@lib/components';

const Wrapper = styled.section`
  ${WrapperBox(520)}
  padding-bottom: 12px;
`;

const Box = styled.div`
  ${props => box(props.theme, '100%', true)}
`;

const Title = styled.h2`
  font-size: ${_ => rem(_.theme.fontSizes[4])};
  text-align: center;
  margin-bottom: ${rem(24)};
`;

const P = styled.p`
  margin-bottom: ${rem(24)};
`;

const Btn = styled.div`
  text-align: center;
`;

const AuthVerify = () => {
  const { resetVerifyEmail } = useAccountStore();
  const [sendLoading, setSendLoading] = useState(false);
  const reset = useCallback(async () => {
    try {
      if (sendLoading) return;
      setSendLoading(true);
      const data = await resetVerifyEmail();
      if (data) Toast.success('邮件已发送，请查收！');
    } catch (err) {
      console.log(err);
    } finally {
      setSendLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendLoading]);
  return (
    <Wrapper>
      <SEO
        title="验证邮箱"
        noindex
      />
      <Box>
        <Title>验证邮箱</Title>
        <P>在继续之前，请检查您的电子邮件以验证邮箱。如果您没有收到电子邮件，请单击下面的按钮以重新发送验证邮件。</P>
        <Btn>
          <Button loading={sendLoading} onClick={reset}>重新发送</Button>
        </Btn>
      </Box>
    </Wrapper>
  );
};

export default withAuth('user-unverified')(
  pageWithTranslation(I18nNamespace.Common)(AuthVerify),
);
