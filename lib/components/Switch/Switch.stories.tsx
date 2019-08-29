import React, { useState } from 'react';
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { withKnobs, text } from '@storybook/addon-knobs';

import { storiesOf } from '@storybook/react';
import { dark, base } from '@lib/common/utils/themes/theme';
import { css } from 'styled-components';
import { Switch } from './index';

const stories = storiesOf('Switch', module);

stories.addDecorator(withKnobs);
stories.addDecorator(withThemesProvider([dark, base]));

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
