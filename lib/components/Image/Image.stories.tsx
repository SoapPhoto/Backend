import * as React from 'react';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { withKnobs, text } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { dark, base } from '@lib/common/utils/themes/theme';
import { Image } from './index';

const stories = storiesOf('Image', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withThemesProvider([dark, base]));

stories
  .add('with Image', () => (
    <Image
      src={text('src', '//cdn.soapphoto.com/c8dc42efb01a6fc7614701d140ec0010.jpg')}
      width="200px"
      height="200px"
    />
  ));
