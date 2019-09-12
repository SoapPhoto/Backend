import React, { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { rem } from 'polished';

import { Modal } from '@lib/components/Modal';
import { theme } from '@lib/common/utils/themes';
import { Formik, FormikActions } from 'formik';
import { FieldInput, FieldSwitch } from '@lib/components/Formik';
import { useTranslation } from '@lib/i18n/useTranslation';
import { IconButton, Button } from '@lib/components/Button';
// import { Trash2 } from '@lib/icon';
// import { useTheme } from '@lib/common/utils/themes/useTheme';
import { UpdateCollectionDot } from '@lib/common/interfaces/collection';
import Toast from '@lib/components/Toast';
import { UpdateCollectionSchema } from '@lib/common/dto/collection';
import { Confirm } from '@lib/components/Confirm';
import { useRouter } from '@lib/router';
import { useAccountStore } from '@lib/stores/hooks';
import { useTheme } from '@lib/common/utils/themes/useTheme';
import { Trash2 } from '@lib/icon';

interface IProps<T> {
  visible: boolean;
  onClose: () => void;
  onUpdate: (value: T) => Promise<void>;
  defaultValue: T;
}

type IValues = UpdateCollectionDot;

const Wrapper = styled.div``;

const Title = styled.h2`
  font-size: ${props => rem(theme('fontSizes[3]')(props))};
  padding: ${rem('24px')};
`;

const Content = styled.div`
  padding: ${rem('24px')};
  padding-top: 0;
  width: 100%;
`;

export const UpdateCollectionModal: React.FC<IProps<UpdateCollectionDot>> = ({
  visible,
  onClose,
  onUpdate,
  defaultValue,
}) => {
  const { replaceRoute } = useRouter();
  const { userInfo } = useAccountStore();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteConfirmLoading, setDeleteConfirmLoading] = React.useState(false);
  const [deleteConfirmDisabled, setDeleteConfirmDisabled] = React.useState(false);
  // const { colors } = useTheme();
  const handleOk = useCallback(async (value: IValues, { setSubmitting }: FormikActions<IValues>) => {
    setConfirmLoading(true);
    setSubmitting(true);
    try {
      await onUpdate(value);
      onClose();
      Toast.success(t('update_sccuess'));
    } catch (error) {
      setSubmitting(false);
      Toast.error(t(error.message));
    } finally {
      setConfirmLoading(false);
    }
  }, [onClose, onUpdate, t]);
  const deleteConfirm = useCallback(async () => {
    if (deleteConfirmLoading) return;
    setDeleteConfirmLoading(true);
    // await deletePicture();
    Toast.success('删除成功！');
    setDeleteConfirmLoading(false);
    setDeleteConfirmDisabled(true);
    await replaceRoute(`/@${userInfo!.username}`);
    window.scrollTo(0, 0);
  }, [deleteConfirmLoading, replaceRoute, userInfo]);
  return (
    <Modal
      boxStyle={{ maxWidth: rem(500), padding: 0 }}
      visible={visible}
      onClose={onClose}
    >
      <Wrapper>
        <Title>{t('collection_edit.title')}</Title>
        <Content>
          <Formik<IValues>
            initialValues={defaultValue}
            onSubmit={handleOk}
            validationSchema={UpdateCollectionSchema(t)}
          >
            {({ handleSubmit, isSubmitting }) => (
              <>
                <FieldInput
                  name="name"
                  label={t('collection_name')}
                  css={css`margin-bottom: ${rem(24)};`}
                />
                <FieldInput
                  name="bio"
                  label={t('collection_bio')}
                  css={css`margin-bottom: ${rem(32)};`}
                />
                <FieldSwitch
                  name="isPrivate"
                  label={t('private')}
                  bio={t('visible_yourself', t('collection'))}
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
                    popover={t('delete_collection')}
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
                </div>
              </>
            )}
          </Formik>
        </Content>
      </Wrapper>
      <Confirm
        title={t('delete_confirm', t('collection'))}
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
