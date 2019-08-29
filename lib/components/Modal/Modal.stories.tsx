import * as React from 'react';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { dark, base } from '@lib/common/utils/themes/theme';
import { css } from 'styled-components';
import { theme } from '@lib/common/utils/themes';
import { Modal } from './index';

const stories = storiesOf('Modal', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withThemesProvider([dark, base]));

stories
  .add('with Modal', () => {
    const visible = boolean('visible', false);
    return (
      <Modal visible={visible}>
        <div css={css`color: ${theme('colors.text')};`}>12312</div>
      </Modal>
    );
  });
