import * as React from 'react';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { withKnobs, text } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { dark, base } from '@lib/common/utils/themes/theme';
import { Button } from '../Button';
import Toast from './index';

const stories = storiesOf('Toast', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withThemesProvider([dark, base]));

stories
  .add('with Toast', () => {
    const content = text('content', 'Hello workd');
    return (
      <>
        <Button onClick={() => Toast.base(content)}>base</Button>
        <Button onClick={() => Toast.error(content)}>error</Button>
        <Button onClick={() => Toast.success(content)}>success</Button>
        <Button onClick={() => Toast.warning(content)}>warning</Button>
      </>
    );
  });
