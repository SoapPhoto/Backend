import React, { useState, useRef } from 'react';
import * as Yup from 'yup';
import _ from 'lodash';
import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { Formik, FormikActions, Form } from 'formik';

import { Modal } from '@lib/components/Modal';
import { CreateCollectionDot, CollectionEntity } from '@lib/common/interfaces/collection';
import { FieldInput } from '@lib/components/Formik/FieldInput';
import { Button } from '@lib/components/Button';
import { FieldSwitch } from '@lib/components/Formik/FieldSwitch';
import { addCollection } from '@lib/services/collection';
import Toast from '@lib/components/Toast';
import { theme } from '@lib/common/utils/themes';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onOk?: (data: CollectionEntity) => void;
}

type Values = CreateCollectionDot;

const Title = styled.h2`
  font-size: ${props => rem(theme('fontSizes[3]')(props))};
  padding: ${rem('24px')};
`;

export const AddCollectionModal: React.FC<IProps> = ({ visible, onClose, onOk }) => {
  const [okLoading, setOkLoading] = useState(false);
  const formRef = useRef<Formik<Values>>(null);
  const onSubmit = async (values: Values, { setSubmitting }: FormikActions<Values>) => {
    setOkLoading(true);
    try {
      const { data } = await addCollection(values);
      Toast.success('添加成功！');
      if (_.isFunction(onOk)) onOk(data);
    } catch (err) {
      console.log(err);
    } finally {
      setOkLoading(false);
      setSubmitting(false);
    }
  };
  return (
    <Modal
      boxStyle={{ maxWidth: '340px', padding: 0 }}
      visible={visible}
      onClose={onClose}
    >
      <Title>新增收藏夹</Title>
      <div css={css`padding: ${rem(24)};`}>
        <Formik<Values>
          initialValues={{
            name: '',
            bio: '',
            isPrivate: false,
          }}
          ref={formRef}
          onSubmit={onSubmit}
          validationSchema={
            Yup.object().shape({
              name: Yup.string()
                .min(1, '收藏夹名称不能小于1个字符')
                .max(26, '收藏夹名称不能大于26个字符')
                .required('请输入收藏夹名称'),
            })
          }
        >
          {({
            isSubmitting,
          }) => (
            <Form>
              <FieldInput
                label="收藏夹名称"
                name="name"
              />
              <FieldInput
                label="收藏夹简介"
                name="bio"
                style={{ marginTop: rem(24), marginBottom: rem(24) }}
              />
              <FieldSwitch
                label="私人"
                bio="仅自己可见"
                name="isPrivate"
              />
              <Button
                css={css`
                  width: 100%;
                  margin-top: ${rem(24)};
                `}
                loading={okLoading}
                disabled={isSubmitting}
              >
                新增收藏夹
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
