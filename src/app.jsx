import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { PageLoading, SettingDrawer } from '@ant-design/pro-layout';
import { history } from 'umi';

import defaultSettings from '../config/defaultSettings';
import { IntlGlobalProvider } from './components/IntlGlobalProvider';
import AuthZApi from './services/authz/AuthZApi';

const loginPath = '/user/login';

export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const currentUser = await AuthZApi.getPermissionForCurrentUser();

      return currentUser;
    } catch (error) {
      history.push(loginPath);
    }

    return undefined;
  };

  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }

  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name || 'VMS',
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;

      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },

    menuHeaderRender: undefined,

    childrenRender: (children, props) => {
      return (
        <IntlGlobalProvider>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme={true}
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({ ...preInitialState, settings }));
              }}
            />
          )}
        </IntlGlobalProvider>
      );
    },
    ...initialState?.settings,
  };
};
