import { SendOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import React from 'react';

const ExportReportToMail = (props) => {
  // let wsOnConnectCallback = function (message) {
  //   const dataBody = JSON.parse(message.body);
  //   if (message.body) {
  //     console.log('>>>>> Message: ' + message.body);
  //   } else {
  //     console.log('>>>>> Empty message');
  //   }
  // };

  // function wsConnect() {
  //   const client = new StompJs.Client({
  //     brokerURL: 'ws://cctv-uat.edsolabs.com:8441/ai-events',
  //     debug: function (str) {
  //       console.log(str);
  //     },
  //     reconnectDelay: 5000,
  //     heartbeatIncoming: 4000,
  //     heartbeatOutgoing: 4000,
  //   });

  //   client.onConnect = function (frame) {
  //     const subscription = client.subscribe('/topic/messages', wsOnConnectCallback);
  //   };

  //   client.onStompError = function (frame) {
  //     console.log('Broker reported error: ' + frame.headers['message']);
  //     console.log('Additional details: ' + frame.body);
  //   };

  //   client.activate();
  // }

  // useEffect(() => {
  //   wsConnect();
  // }, []);

  return <SendOutlined />;
};

function mapStateToProps(state) {
  return { filterParams: state?.chart?.payload };
}

export default connect(mapStateToProps)(ExportReportToMail);
