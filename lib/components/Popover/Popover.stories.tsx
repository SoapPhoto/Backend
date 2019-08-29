import * as React from 'react';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { withKnobs, select } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { dark, base } from '@lib/common/utils/themes/theme';
import { Popover } from './index';

const stories = storiesOf('Popover', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withThemesProvider([dark, base]));

stories
  .add('with Popover', () => (
    <div>
      <Popover
        trigger={select('trigger', { hover: 'hover', click: 'click' }, 'click')}
        placement="top"
        theme={select('theme', { dark: 'dark', light: 'light', None: null }, 'dark')}
        openDelay={100}
        content={<span>取消喜欢</span>}
      >
        <span>点我</span>
      </Popover>
    </div>
  ));
