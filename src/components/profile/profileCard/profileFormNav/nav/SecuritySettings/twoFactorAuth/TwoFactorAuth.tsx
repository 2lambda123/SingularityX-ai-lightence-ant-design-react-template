import React, { useState } from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { ProfileForm } from '../../../ProfileForm/ProfileForm';
import { TwoFactorOptions } from './TwoFactorOptions/TwoFactorOptions';
import { TwoFactorSwitch } from './TwoFactorSwitch/TwoFactorSwitch';
import { Button } from '@app/components/common/buttons/Button/Button';
import { SecurityCodeForm } from '@app/components/auth/SecurityCodeForm/SecurityCodeForm';
import { notificationController } from '@app/controllers/notificationController';
import { setUser } from '@app/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { TwoFactorAuthOption } from '@app/interfaces/interfaces';
import * as S from './TwoFactorAuth.styles';

export interface CurrentOption {
  value: 'phone' | 'email';
  isVerified: boolean;
}

export const TwoFactorAuth: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);

  const [isEnabled, setEnabled] = useState(Boolean(user?.email.verified || user?.phone.verified));
  const [selectedOption, setSelectedOption] = useState<TwoFactorAuthOption>('email');
  const [isClickedVerify, setClickedVerify] = useState(false);

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const onClickVerify = async () => {
    setClickedVerify(true);
  };

  const onVerify = () => {
    if (user) {
      notificationController.success({ message: t('common.success') });
      setClickedVerify(false);

      const newUser = { ...user, [selectedOption]: { ...user[selectedOption], verified: true } };

      dispatch(setUser(newUser));
    }
  };

  return (
    <>
      <ProfileForm
        name="twoFactorAuth"
        withoutSuccess
        initialValues={{
          email: user?.email.name,
          phone: user?.phone.number,
        }}
        footer={(loading) =>
          (isEnabled && (
            <Button type="link" loading={loading} htmlType="submit">
              {t('profile.nav.securitySettings.verify')}
            </Button>
          )) || <span />
        }
        onFinish={onClickVerify}
      >
        <Row>
          <Col span={24}>
            <TwoFactorSwitch isEnabled={isEnabled} setEnabled={setEnabled} />
          </Col>

          {isEnabled && (
            <Col span={24}>
              <TwoFactorOptions selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            </Col>
          )}
        </Row>
      </ProfileForm>
      <S.AuthModal
        destroyOnClose
        visible={isClickedVerify}
        footer={false}
        closable={false}
        onCancel={() => setClickedVerify(false)}
      >
        <SecurityCodeForm onBack={() => setClickedVerify(false)} onFinish={onVerify} />
      </S.AuthModal>
    </>
  );
};
