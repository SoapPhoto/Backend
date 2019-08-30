import * as React from 'react';
import useState from 'storybook-addon-state';

import { storiesOf } from '@storybook/react';
import { Button } from '@lib/components/Button';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import { EditPictureModal } from './EditModal';

const stories = storiesOf('Picture', module);

stories.addDecorator(withGlobalStyle);

stories
  .add('with Picture EditModal', () => {
    const [visible, setVisible] = useState('clicks', false);
    return (
      <>
        <Button onClick={() => setVisible(true)}>点击</Button>
        <EditPictureModal
          onClose={() => setVisible(false)}
          visible={visible}
        />
      </>
    );
  });
