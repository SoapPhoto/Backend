import * as React from 'react';
import { text } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import { Image } from './index';

const stories = storiesOf('Image', module);

stories.addDecorator(withGlobalStyle);

stories
  .add('with Image', () => (
    <Image
      src={text('src', '//cdn.soapphoto.com/c8dc42efb01a6fc7614701d140ec0010.jpg')}
      width="200px"
      height="200px"
    />
  ));
