import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { Preloader } from '@ui';
import {
  clearErrors,
  errorSelector,
  loginUserThunk
} from '../../services/slices/userSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(errorSelector);

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    dispatch(loginUserThunk({ email, password }))
      .then(() => {
        navigate('/');
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
