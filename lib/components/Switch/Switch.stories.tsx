import React, { useState } from 'react';
import { text } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { css } from 'styled-components';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import { Switch } from './index';

const stories = storiesOf('Switch', module);

stories.addDecorator(withGlobalStyle);

const UseState: any = ({ render, initialValue }: any) => {
  const [variable, setVariable] = useState(initialValue);
  return render(variable, setVariable);
};

stories
  .add('with Switch', () => (
    <div
      css={css`
          width: 120px;
        `}
    >
      <UseState
        initialValue={false}
        render={(checked: any, setChecked: any) => (
          <Switch
            label={text('label', '隐私')}
            bio={text('bio', '外人不可见')}
            checked={checked}
            onChange={setChecked}
          />
        )}
      />
    </div>
  ));
