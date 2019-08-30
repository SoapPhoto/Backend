import React from 'react';
import { rem } from 'polished';

import { Modal } from '@lib/components/Modal';
import styled, { css } from 'styled-components';
import { theme } from '@lib/common/utils/themes';
import { Formik, FormikActions, Field } from 'formik';
import { FieldInput, FieldSwitch } from '@lib/components/Formik';
import { Button, IconButton } from '@lib/components/Button';
import { Trash2 } from '@lib/icon';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import Tag from '@lib/components/Tag';
import { EditPictureSchema } from '@lib/common/dto/picture';
import { useTranslation } from '@lib/i18n/useTranslation';
import Toast from '@lib/components/Toast';
import { UpdatePictureDot, PictureEntity } from '@lib/common/interfaces/picture';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onOk: (info: PictureEntity) => void;
  update: (data: UpdatePictureDot) => Promise<any>;
  defaultValue: IValues;
}

interface IValues {
  title: string;
  bio: string;
  isPrivate: boolean;
  tags: string[];
}

const Wrapper = styled.div``;

const Content = styled.div`
  padding: ${rem('24px')};
  padding-top: 0;
  max-width: ${rem(600)};
  width: 100%;
`;

const Title = styled.h2`
  font-size: ${_ => rem(theme('fontSizes[3]')(_))};
  padding: ${rem('24px')};
`;

export const EditPictureModal: React.FC<IProps> = ({
  visible,
  onClose,
  onOk,
  defaultValue,
  update,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const handleOk = async (value: IValues, { setSubmitting }: FormikActions<IValues>) => {
    setConfirmLoading(true);
    setSubmitting(false);
    try {
      const { data } = await update(value);
      onClose();
      onOk(data);
      Toast.success(t('picture_update_sccuess'));
    } catch (error) {
      setSubmitting(false);
      Toast.error(t(error.message));
    } finally {
      setConfirmLoading(false);
    }
  };
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      boxStyle={{ padding: 0 }}
    >
      <Wrapper>
        <Title>编辑</Title>
        <Content>
          <Formik<IValues>
            initialValues={defaultValue}
            onSubmit={handleOk}
            validationSchema={EditPictureSchema(t)}
          >
            {({ handleSubmit, isSubmitting }) => (
              <>
                <FieldInput
                  name="title"
                  label={t('picture_title')}
                  css={css`margin-bottom: ${rem(24)};`}
                />
                <FieldInput
                  name="bio"
                  label={t('picture_bio')}
                  css={css`margin-bottom: ${rem(32)};`}
                />
                <Field
                  name="tags"
                  render={({ field }: any) => (
                    <Tag
                      value={field.value}
                      css={css`margin-bottom: ${rem(12)};`}
                      onChange={(e) => {
                        field.onChange({
                          target: {
                            name: field.name,
                            value: e,
                          },
                        });
                      }}
                    />
                  )}
                />
                <FieldSwitch
                  name="isPrivate"
                  label="私人"
                  bio="仅自己可见"
                />
                <div
                  css={css`
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: ${rem(24)};
                  `}
                >
                  <IconButton
                    popover="删除图片"
                  >
                    <Trash2
                      color={colors.danger}
                    />
                  </IconButton>
                  <Button
                    loading={confirmLoading}
                    onClick={() => handleSubmit()}
                    disabled={isSubmitting}
                    type="submit"
                  >
                    修改
                  </Button>
                </div>
              </>
            )}
          </Formik>
        </Content>
      </Wrapper>
    </Modal>

  );
};
