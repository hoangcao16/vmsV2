import Icon from '@ant-design/icons';
const Osvg = () => (
  <svg width="10" height="10" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.5 5.27C4.914 5.27 6.076 4.108 6.076 2.68C6.076 1.266 4.914 0.104 3.5 0.104C2.072 0.104 0.91 1.266 0.91 2.68C0.91 4.108 2.072 5.27 3.5 5.27ZM3.5 4.71C2.366 4.71 1.47 3.8 1.47 2.68C1.47 1.574 2.366 0.663999 3.5 0.663999C4.606 0.663999 5.516 1.574 5.516 2.68C5.516 3.8 4.606 4.71 3.5 4.71Z"
      fill="#1890FF"
    />
  </svg>
);
const CircleIcon = (props) => <Icon component={Osvg} {...props} />;
export default CircleIcon;
