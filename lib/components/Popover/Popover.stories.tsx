import * as React from 'react';
import { select, text } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import { Popover } from './index';

const stories = storiesOf('Popover', module);

stories.addDecorator(withGlobalStyle);

stories
  .add('with Popover', () => (
    <div>
      <Popover
        trigger={select('trigger', { hover: 'hover', click: 'click' }, 'click')}
        placement={text('placement', 'top') as any}
        theme={select('theme', { dark: 'dark', light: 'light', None: null }, 'dark')}
        openDelay={100}
        content={<span>取消喜欢</span>}
      >
        <span style={{ marginLeft: '200px' }}>点我</span>
      </Popover>
    </div>
  ));
