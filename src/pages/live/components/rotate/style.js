import styled from 'styled-components';
export const StyleContainer = styled.div`
  display: flex;
  align-items: center;
  nav {
    position: relative;
    box-sizing: border-box;
    width: 200px;
    height: 200px;
    margin: 10px auto;
    padding: 5px;
    background: #000000;
    border-radius: 50%;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  a {
    text-decoration: none;
  }

  .center-wrapper {
    position: absolute;
    top: 25%;
    left: 25%;
    display: block;
    width: 50%;
    height: 50%;
    background-color: black;
    border-radius: 50%;
  }

  .center-button {
    position: absolute;
    top: 10%;
    left: 10%;
    display: block;
    width: 80%;
    height: 80%;
    background-color: #222121;
    border: 1px solid #ffffff;
    border-radius: 50%;
    transform: rotate(-45deg);

    &--content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
      height: 100%;
    }
  }

  .button {
    position: relative;
    display: block;
    float: left;
    width: 46%;
    height: 46%;
    margin: 2%;
    background-color: #222121;
    box-shadow: 1px 0px 3px 1px rgba(0, 0, 0, 0.4), inset 0 0 0 1px #fff;
    cursor: pointer;
  }

  .button::after {
    position: absolute;
    display: block;
    width: 50%;
    height: 50%;
    background: #ffffff;
    border-radius: inherit;
    content: '';
  }

  .button.top {
    background: -webkit-radial-gradient(bottom right, ellipse cover, #fff 35%, #eee 75%);
    background: radial-gradient(bottom right, ellipse cover, #fff 35%, #eee 75%);
    border-radius: 100% 0 0 0;
  }

  .button.top::after {
    right: 0;
    bottom: 0;
    box-shadow: inset 2px 1px 2px 0 rgba(0, 0, 0, 0.4), 10px 10px 0 10px #ffffff;
    -webkit-transform: skew(-3deg, -3deg) scale(0.96);
    -moz-transform: skew(-3deg, -3deg) scale(0.96);
    transform: skew(-3deg, -3deg) scale(0.96);
  }

  .button.right {
    background: -webkit-radial-gradient(bottom left, ellipse cover, #fff 35%, #eee 75%);
    background: radial-gradient(bottom left, ellipse cover, #fff 35%, #eee 75%);
    border-radius: 0 100% 0 0;
  }

  .button.right::after {
    bottom: 0;
    left: 0;
    box-shadow: inset -2px 3px 2px -2px rgba(0, 0, 0, 0.4), -10px 10px 0 10px #ffffff;
    -webkit-transform: skew(3deg, 3deg) scale(0.96);
    -moz-transform: skew(3deg, 3deg) scale(0.96);
    transform: skew(3deg, 3deg) scale(0.96);
  }

  .button.left {
    background: -webkit-radial-gradient(top right, ellipse cover, #fff 35%, #eee 75%);
    background: radial-gradient(top right, ellipse cover, #fff 35%, #eee 75%);
    border-radius: 0 0 0 100%;
  }

  .button.left::after {
    top: 0;
    right: 0;
    box-shadow: inset 2px -1px 2px 0 rgba(0, 0, 0, 0.4), 10px -10px 0 10px #ffffff;
    -webkit-transform: skew(3deg, 3deg) scale(0.96);
    -moz-transform: skew(3deg, 3deg) scale(0.96);
    transform: skew(3deg, 3deg) scale(0.96);
  }

  .button.bottom {
    background: -webkit-radial-gradient(top left, ellipse cover, #fff 35%, #eee 75%);
    background: radial-gradient(top left, ellipse cover, #fff 35%, #eee 75%);
    border-radius: 0 0 100% 0;
  }

  .button.bottom::after {
    top: 0;
    left: 0;
    box-shadow: inset -2px -3px 2px -2px rgba(0, 0, 0, 0.4), -10px -10px 0 10px #ffffff;
    -webkit-transform: skew(-3deg, -3deg) scale(0.96);
    -moz-transform: skew(-3deg, -3deg) scale(0.96);
    transform: skew(-3deg, -3deg) scale(0.96);
  }

  .iIcon {
    position: absolute;
    top: 36%;
    left: 39%;
    color: white;
    font-size: 28px;
    text-shadow: 1px 1px 2px #fff, 0px 0px 0px rgba(0, 0, 0, 0.5);
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }

  .top .iIcon {
    top: 17%;
    left: 26%;
  }

  .left .iIcon {
    top: 31%;
    left: 30%;
  }

  .right .iIcon {
    top: 20%;
    left: 41%;
  }

  .bottom .iIcon {
    top: 28%;
    left: 37%;
  }
`;
