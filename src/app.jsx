import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { SettingDrawer } from '@ant-design/pro-layout';
import 'react-phone-number-input/style.css';
import { getDvaApp, history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import CustomLoading from './components/CustomLoading';
import { IntlGlobalProvider } from './components/IntlGlobalProvider';
import AuthZApi from './services/authz/AuthZApi';

const loginPath = '/user/login';

export const initialStateConfig = {
  loading: <CustomLoading />,
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
  // const app = getDvaApp();
  // const state = app?._store?.getState();
  // console.log(window.g_app);
  // const isFullScreen = state?.globalstore?.isFullScreen;
  // console.log(isFullScreen);
  const titleLogo = document.querySelector('.ant-pro-global-header-logo h1');
  if (titleLogo) {
    titleLogo.textContent = '';
  }

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
    onCollapse: (collapsed) => {
      const app = getDvaApp();
      const dispatch = app._store.dispatch;
      dispatch({
        type: 'globalstore/changeLayoutCollapsed',
      });
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
