import React, { useCallback, useEffect } from 'react';
import { rem } from 'polished';

import { Modal } from '@lib/components/Modal';
import styled from 'styled-components';
import { theme } from '@lib/common/utils/themes';
import { Formik, FormikHelpers, Field } from 'formik';
import { FieldInput, FieldSwitch } from '@lib/components/Formik';
import { Button, IconButton } from '@lib/components/Button';
import { Trash2 } from '@lib/icon';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import Tag from '@lib/components/Tag';
import { EditPictureSchema } from '@lib/common/dto/picture';
import { useTranslation } from '@lib/i18n/useTranslation';
import Toast from '@lib/components/Toast';
import { UpdatePictureDot, PictureEntity } from '@lib/common/interfaces/picture';
import { Confirm } from '@lib/components/Confirm';
import { useRouter } from '@lib/router';
import { useAccountStore } from '@lib/stores/hooks';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onOk: (info: PictureEntity) => void;
  update: (data: UpdatePictureDot) => Promise<any>;
  defaultValue: IValues;
  deletePicture: () => Promise<any>;
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

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${rem(24)};
`;

export const EditPictureModal: React.FC<IProps> = ({
  visible,
  onClose,
  onOk,
  defaultValue,
  update,
  deletePicture,
}) => {
  const { replaceRoute } = useRouter();
  const { userInfo } = useAccountStore();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [deleteConfirmLoading, setDeleteConfirmLoading] = React.useState(false);
  const [deleteConfirmDisabled, setDeleteConfirmDisabled] = React.useState(false);
  useEffect(() => {
    if (!visible) setConfirmVisible(false);
    return () => {
      // setConfirmVisible(false);
    };
  }, [onClose, visible]);
  const handleOk = async (value: IValues, { setSubmitting }: FormikHelpers<IValues>) => {
    setSubmitting(false);
    setConfirmLoading(true);
    try {
      const data = await update(value);
      onClose();
      onOk(data);
      Toast.success(t('update_sccuess'));
      setSubmitting(true);
    } catch (error) {
      setSubmitting(false);
      Toast.error(t(error.message));
    } finally {
      setConfirmLoading(false);
    }
  };

  const deleteConfirm = useCallback(async () => {
    if (deleteConfirmLoading) return;
    setDeleteConfirmLoading(true);
    try {
      await deletePicture();
      setDeleteConfirmDisabled(true);
      Toast.success('删除成功！');
      await replaceRoute(`/@${userInfo!.username}`);
      window.scrollTo(0, 0);
    } catch (error) {
      setDeleteConfirmDisabled(false);
    } finally {
      setDeleteConfirmLoading(false);
    }
    // onClose();
  }, [deleteConfirmLoading, deletePicture, replaceRoute, userInfo]);
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      boxStyle={{ padding: 0, maxWidth: rem(500) }}
    >
      <Wrapper>
        <Title>{t('picture_edit.title')}</Title>
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
                  style={{ marginBottom: rem(24) }}
                />
                <FieldInput
                  name="bio"
                  label={t('picture_bio')}
                  style={{ marginBottom: rem(24) }}
                />
                <Field
                  name="tags"
                  render={({ field }: any) => (
                    <Tag
                      value={field.value}
                      style={{ marginBottom: rem(12) }}
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
                  label={t('private')}
                  bio={t('visible_yourself', t('picture'))}
                />
                <Footer>
                  <IconButton
                    popover={t('delete_picture')}
                    onClick={() => setConfirmVisible(true)}
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
                    {t('save')}
                  </Button>
                </Footer>
              </>
            )}
          </Formik>
        </Content>
      </Wrapper>
      <Confirm
        title={t('delete_confirm', t('picture'))}
        visible={confirmVisible}
        confirmText={t('delete')}
        confirmProps={{
          disabled: deleteConfirmDisabled,
          danger: true,
          onClick: deleteConfirm,
        }}
        confirmLoading={deleteConfirmLoading}
        confirmIcon={<Trash2 size={14} />}
        onClose={() => setConfirmVisible(false)}
      />
    </Modal>

  );
};
