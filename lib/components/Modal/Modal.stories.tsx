import * as React from 'react';
import useState from 'storybook-addon-state';

import { storiesOf } from '@storybook/react';
import { css } from 'styled-components';
import { theme } from '@lib/common/utils/themes';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import { Modal } from './index';
import { Button } from '../Button';

const stories = storiesOf('Modal', module);

stories.addDecorator(withGlobalStyle);

stories
  .add('with Modal', () => {
    const [visible, setVisible] = useState('clicks', false);
    return (
      <>
        <Button onClick={() => setVisible(true)}>打开</Button>
        <Modal
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <div css={css`color: ${theme('colors.text')};`}>12312</div>
        </Modal>
      </>
    );
  });
