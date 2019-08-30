import * as React from 'react';
import { text, number } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import { Avatar } from './index';

const stories = storiesOf('Avatar', module);

stories.addDecorator(withGlobalStyle);

stories
  .add('with Avatar', () => (
    <Avatar
      src={text('src', '//cdn.soapphoto.com/c8dc42efb01a6fc7614701d140ec0010.jpg')}
      size={number('size', 40)}
    />
  ));
