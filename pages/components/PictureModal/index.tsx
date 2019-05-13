import React from 'react';
import ReactDOM from 'react-dom';

import { PictureEntity } from '@pages/common/interfaces/picture';
import { getScrollWidth, setBodyCss } from '@pages/common/utils';
import { request } from '@pages/common/utils/request';
import { PictureImage } from '@pages/containers/Picture/Item';
import { Router } from '@pages/routes';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Box, Content, Mask, Warpper } from './styles';

interface IProps {
  pictureId: string;
}

@observer
export class PictureModal extends React.Component<IProps> {
  @observable public detail?: PictureEntity;
  public wrapperRef = React.createRef<HTMLDivElement>();
  get id() {
    return this.props.pictureId;
  }
  get scrollWidth() {
    return getScrollWidth();
  }
  public initStyle?: () => void;
  public componentDidMount() {
    this.getDetail();
    this.initStyle = setBodyCss({
      overflowY: 'hidden',
      paddingRight: `${this.scrollWidth}px`,
    });
  }
  public componentWillUnmount() {
    if (this.initStyle) {
      this.initStyle();
    }
  }
  public getDetail = async () => {
    const { data } = await request.get<PictureEntity>(`/api/picture/${this.id}`);
    this.detail = data;
  }
  public handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  　e.stopPropagation();
    if (e.target === (this.wrapperRef.current as any)) {
      Router.back();
    }
  }
  public render() {
    return ReactDOM.createPortal(
      <div>
        <Mask />
        <Warpper ref={this.wrapperRef as any} onClick={this.handleClick}>
          {
            this.detail &&
            <Content>
              <Box style={{ width: '100%', position: 'relative' }}>
                <span>{this.detail.user.username}</span>
                <PictureImage detail={this.detail} />
              </Box>
            </Content>
          }
        </Warpper>
      </div>,
      document.querySelector('body')!,
    );
  }
}