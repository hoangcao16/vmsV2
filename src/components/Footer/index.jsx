import { DefaultFooter } from '@ant-design/pro-layout';

const Footer = () => {
  return (
    <DefaultFooter
      copyright="Edso Labs. All Rights Reserved."
      links={[
        {
          key: 'Hệ thống giám sát - VMS',
          title: 'Hệ thống giám sát - VMS',
          href: '/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
