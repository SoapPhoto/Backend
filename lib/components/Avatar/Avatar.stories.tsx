import * as React from 'react';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { withKnobs, text, number } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { dark, base } from '@lib/common/utils/themes/theme';
import { Avatar } from './index';

const stories = storiesOf('Avatar', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withThemesProvider([dark, base]));

stories
  .add('with Avatar', () => (
    <Avatar
      src={text('src', '')}
      size={number('size', 40)}
    />
  ));
