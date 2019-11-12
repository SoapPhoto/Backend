import React from 'react';
import ReactDOM from 'react-dom';

import { PictureEntity } from '@lib/common/interfaces/picture';
import { getScrollWidth, setBodyCss } from '@lib/common/utils';
import { request } from '@lib/common/utils/request';
import { PictureImage } from '@lib/containers/Picture/Image';
import { Router } from '@lib/routes';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Box, Content, ImgBox, Mask, Wrapper,
} from './styles';

interface IProps {
  pictureId: string;
}

@observer
export class PictureModal extends React.Component<IProps> {
  @observable public detail?: PictureEntity;

  public wrapperRef = React.createRef<HTMLDivElement>();

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

  get id() {
    const { pictureId } = this.props;
    return pictureId;
  }

  get scrollWidth() {
    return getScrollWidth();
  }


  public getDetail = async () => {
    const { data } = await request.get<PictureEntity>(`/api/picture/${this.id}`);
    this.detail = data;
  }

  public handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    if (e.target === this.wrapperRef.current) {
      Router.back();
    }
  }

  public render() {
    return ReactDOM.createPortal(
      (
        <div>
          <Mask />
          <Wrapper ref={this.wrapperRef} onClick={this.handleClick}>
            {
              this.detail
              && (
                <Content>
                  <Box>
                    <ImgBox>
                      <div>
                        <PictureImage detail={this.detail} />
                      </div>
                    </ImgBox>
                    {/* <span>{this.detail.user.username}</span> */}
                  </Box>
                </Content>
              )
            }
          </Wrapper>
        </div>
      ),
      document.querySelector('body')!,
    );
  }
}
