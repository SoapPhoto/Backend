import * as React from 'react';
import useState from 'storybook-addon-state';

import { storiesOf } from '@storybook/react';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import { Button } from '../Button';
import { EXIFEditModal } from './Edit';

const stories = storiesOf('EXIF Edit', module);

stories.addDecorator(withGlobalStyle);

stories
  .add('with Modal', () => {
    const [visible, setVisible] = useState('clicks', false);
    return (
      <div>
        <Button onClick={() => setVisible(true)}>打开</Button>
        {/* <EXIFEditModal
          visible={visible}
          initialValues={{
            make: '',
            model: '',
            focalLength: '4.2',
            aperture: '1.7',
            exposureTime: '1/20',
            ISO: '400',
          }}
          onClose={() => setVisible(false)}
        /> */}
      </div>
    );
  });
