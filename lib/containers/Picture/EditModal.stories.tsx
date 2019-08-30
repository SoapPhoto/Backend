import * as React from 'react';
import useState from 'storybook-addon-state';

import { storiesOf } from '@storybook/react';
import { Button } from '@lib/components/Button';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import { object } from '@storybook/addon-knobs';
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
          defaultValue={object('defaultValue', {
            title: '哈哈哈哈',
            bio: '还行吧',
            isPrivate: false,
            tags: ['test'],
          })}
          onOk={() => {}}
          update={async (data: any) => console.log(data)}
        />
      </>
    );
  });
