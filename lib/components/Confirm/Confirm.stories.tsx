import * as React from 'react';

import { storiesOf } from '@storybook/react';
import { withGlobalStyle } from '@lib/common/storybook/withGlobalStyle';
import useState from 'storybook-addon-state';
import { text, object, boolean } from '@storybook/addon-knobs';
import { Button } from '../Button';
import { Confirm } from './index';

const stories = storiesOf('Confirm', module);

stories.addDecorator(withGlobalStyle);

stories
  .add('with Confirm', () => {
    const [visible, setVisible] = useState('clicks', false);
    return (
      <>
        <Button
          onClick={() => setVisible(true)}
        >
          打开
        </Button>
        <Confirm
          title={text('title', '确定删除吗？')}
          visible={visible}
          onClose={() => setVisible(false)}
          confirmText={text('confirmText', '删除')}
          confirmProps={object('confirmProps', { danger: true })}
          confirmLoading={boolean('confirmLoading', false)}
          cancelText={text('cancelText', '取消')}
        />
      </>
    );
  });
