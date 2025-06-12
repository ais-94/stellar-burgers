import { FC } from 'react';
import { NavLink , useLocation } from 'react-router-dom';
import clsx from 'clsx';

import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  const currentLocation = location.pathname;

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <NavLink 
              className={clsx(
                styles.link,
                currentLocation === '/'
                  ? [styles.link_active, styles.link]
                  : styles.link
              )}
              to={'/'}
            >
              <BurgerIcon
                type={currentLocation === '/' ? 'primary' : 'secondary'}
              />
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </NavLink>
          </>
          <>
            <NavLink 
              className={clsx(
                styles.link,
                currentLocation === '/feed'
                  ? [styles.link_active, styles.link]
                  : styles.link
              )}
              to={'/feed'}
            >
              <ListIcon
                type={currentLocation === '/feed' ? 'primary' : 'secondary'}
              />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </NavLink>
          </>
        </div>
        <NavLink  className={styles.link} to={'/'}>
          <div className={styles.logo}>
            <Logo className='' />
          </div>
        </NavLink>
        <div className={styles.link_position_last}>
          <NavLink 
            className={clsx(
              styles.link,
              currentLocation === '/profile'
                ? [styles.link_active, styles.link]
                : styles.link
            )}
            to={'/profile'}
          >
            <ProfileIcon
              type={currentLocation === '/profile' ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
