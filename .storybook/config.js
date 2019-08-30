import { configure, addDecorator } from '@storybook/react'
import { withThemesProvider } from 'storybook-addon-styled-component-theme';
import { withKnobs } from '@storybook/addon-knobs';

import { dark, base } from '@lib/common/utils/themes/theme';
import { GlobalStyle } from '@lib/containers/Theme/GlobalStyle';
import '@storybook/addon-console';

const req = require.context('../lib', true, /.stories.tsx$/)

addDecorator(withKnobs);
addDecorator(withThemesProvider([base, dark]));

function loadStories() {
  req.keys().forEach(filename => req(filename))
}


configure(loadStories, module)
