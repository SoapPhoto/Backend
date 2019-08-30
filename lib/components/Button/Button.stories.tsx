import * as React from 'react';
import { boolean } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import { Button } from './index';

const stories = storiesOf('Button', module);

stories
  .addDecorator(withGlobalStyle)
  .add('with Button', () => (
    <Button
      loading={boolean('loading', false)}
      disabled={boolean('disabled', false)}
    >
      test
    </Button>
  ));
