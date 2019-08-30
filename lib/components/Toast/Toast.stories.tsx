import * as React from 'react';
import { text, number } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import { Button } from '../Button';
import Toast from './index';

const stories = storiesOf('Toast', module);

stories.addDecorator(withGlobalStyle);

stories
  .add('with Toast', () => {
    const content = text('content', 'Hello workd');
    const duration = number('duration', 100000);
    return (
      <>
        <Button onClick={() => Toast.base(content, duration)}>base</Button>
        <Button onClick={() => Toast.error(content, duration)}>error</Button>
        <Button onClick={() => Toast.success(content, duration)}>success</Button>
        <Button onClick={() => Toast.warning(content, duration)}>warning</Button>
      </>
    );
  });
