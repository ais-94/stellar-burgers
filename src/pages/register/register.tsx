import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import {
  clearErrors,
  errorSelector,
  registerUserThunk
} from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const error = useSelector(errorSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(clearErrors());

    dispatch(registerUserThunk({ email, password, name: userName }))
      .then(() => {
        navigate('/');
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
