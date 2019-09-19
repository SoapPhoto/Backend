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
    const [visible1, setVisible1] = useState('click', false);
    return (
      <div style={{ textAlign: 'right' }}>
        <p>testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest</p>
        <p>testtesttesttesttesttesttesttesttesttest</p>
        <p>testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <Button onClick={() => setVisible(true)}>打开</Button>
        <Modal
          visible={visible}
          onClose={() => setVisible(false)}
        >
          <div onClick={() => setVisible1(true)} css={css`color: ${theme('colors.text')};`}>12312</div>
        </Modal>
        <Modal
          visible={visible1}
          onClose={() => setVisible1(false)}
        >
          <div css={css`color: ${theme('colors.text')};`}>test</div>
        </Modal>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
      </div>
    );
  });
