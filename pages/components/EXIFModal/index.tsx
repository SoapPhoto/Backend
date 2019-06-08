import React from 'react';
import ReactDOM from 'react-dom';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { computed } from 'mobx';
import { Box, Content, Title, Warpper } from './styles';

interface IProps {
  picture: PictureEntity;
}

export class EXIFModal extends React.Component<IProps> {
  @computed get background() {
    const {  } = this.props.picture;
    return 'linear-gradient(rgba(255, 255, 255, 0.8), white 150px), url("")';
  }
  public render() {
    return ReactDOM.createPortal(
      (
        <Warpper>
          <Content>
            <Box style={{ background: this.background }}>
              <Title>信息</Title>
              <div>123123</div>
            </Box>
          </Content>
        </Warpper>
      ),
      document.querySelector('body')!,
    );
  }
}
