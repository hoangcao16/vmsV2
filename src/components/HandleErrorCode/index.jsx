import { notify } from '../Notify';
import handleForbiddenCode from './handleForbidden';
const StatusBadRequest = 601;
const StatusUnauthorized = 602;
const StatusNotFound = 603;
const StatusConflict = 604;
const StatusForbidden = 605;
const StatusInternalServerError = 606;
const WrongPass = 607;
const AccountNotExists = 608;
const AccountAlreadyExists = 609;
const KCamproxyBadRequest = 15101;
const KCamproxyMissingToken = 15102;
const KCamproxySDPRemoteOfferFailed = 15103;
const KCamproxySDPCreateAnswerFailed = 15104;
const KCamproxySDPLocalOfferFailed = 15105;
const KCamproxyAddTrackFailed = 15106;
const KCamproxyNewLocalStaticFailed = 15107;
const KCamproxyCamNotFound = 15108;
const KCamproxyCreatePeerConnFailed = 15109;
const KPandaMissingFieldDomainOrUser = 12101;
const KPandaBadRequest = 12102;
const KPandaInternalServer = 12103;
const KPandaCamproxyNotFound = 12104;
const KPandaCamNotFound = 12105;
const KCheetahBadRequest = 901;
const KCheetahNvrNotFound = 902;
const KCheetahSendReqFailed = 903;
const KCheetahInternalServerError = 904;
const KControllerBadRequest = 701;
const KControllerForbidden = 702;
const KControllerNotFound = 703;
const KControllerDuplicate = 704;
const KControllerCannotDelete = 705;
const KControllerInternalServerError = 706;
const KLionBadRequest = 1101;
const KLionPlaybackNotFound = 1102;
const KLionSendReqFailed = 1103;
const KLionInternalServerError = 1104;
const KLionInternalFileNotFound = 1105;
const KPlaybackBadRequest = 1401;
const KPlaybackExistToken = 1405;
const FAILED = 1001;
const COMING_SOON = 1002;
const AUTHZ_NO_RESPONSE = 1005;
const MISSING_PARAMS = 1010;
const CAMERA_ID_MISSING = 1011;
const DIRECTION_MISSING = 1012;
const ISSTOP_MISSING = 1013;
const SPEED_MISSING = 1014;
const PRESET_ID_MISSING = 1015;
const PRESET_TOUR_ID_MISSING = 1016;
const LIST_POINT_MISSING = 1017;
const TIME_DELAY_MISSING = 1018;
const NAME_MISSING = 1019;
const IP_STRIP_MISSING = 1020;
const PTZ_MISSING = 1021;
const PTZ_KEY_MISSING = 1022;
const ZONE_MISSING = 1023;
const VENDOR_MISSING = 1026;
const CAMERA_ID_OUT_OF_RANGE = 1031;
const DIRECTION_OUT_OF_RANGE = 1032;
const ISSTOP_OUT_OF_RANGE = 1033;
const SPEED_OUT_OF_RANGE = 1034;
const PRESET_ID_OUT_OF_RANGE = 1035;
const PRESET_TOUR_ID_OUT_OF_RANGE = 1036;
const LIST_POINT_OUT_OF_RANGE = 1037;
const TIME_DELAY_OUT_OF_RANGE = 1038;
const NAME_OUT_OF_RANGE = 1039;
const IP_STRIP_OUT_OF_RANGE = 1040;
const ZONE_OUT_OF_RANGE = 1043;
const PAGE_OUT_OF_RANGE = 1044;
const SIZE_OUT_OF_RANGE = 1045;
const USER_OUT_OF_RANGE = 1047;
const PTZ_EXIST = 1050;
const PTZ_BUSY = 1051;
const SYSTEM_BUSY = 1052;
const PTZ_FAILSE = 1060;
const PTZ_CAMERA_NO_CONNECT = 1061;
const PTZ_PRESET_NO_EXIST = 1062;
const PTZ_PRESET_OUT_OF_RANGE = 1063;
const PTZ_NO_SUPPORT = 1064;
const PTZ_NO_EXIST = 1065;
const PTZ_CONNECTED_NOT_EXIST = 1066;
const PTZ_NOT_RESPONSE = 1067;
const PTZ_CANT_READ_RESPONSE = 1068;
const PTZ_LOGIN_FAILSE = 1069;
const PTZ_PARAM_MISSING = 1070;
const PTZ_ACTION_MISSING = 1071;
const CANT_INSERT_DATABASE = 1080;
const CANT_UPDATE_DATABASE = 1081;
const CANT_DELETE_DATABASE = 1082;
const ISAPI_CANT_FIND_CHANEL = 1085;
const PRESET_EXIST_IN_PRESET_TOUR = 1086;
const SCAN_EMPTY = 1090;
const SCAN_FAILED = 1091;

const HandleErrorCode = (props) => {
  const { code, message, payload, deny_permission_codes } = props;
  switch (code) {
    case StatusBadRequest:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.StatusBadRequest');
      return null;
    case StatusUnauthorized:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.StatusUnauthorized',
      );
      return null;
    case StatusNotFound:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.StatusNotFound');
      return null;
    case StatusConflict:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.StatusConflict');
      return null;
    case StatusForbidden:
      handleForbiddenCode(deny_permission_codes);
      return null;
    case StatusInternalServerError:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.StatusInternalServerError',
      );
      return null;
    case WrongPass:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.WrongPass');
      return null;
    case AccountNotExists:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.AccountNotExists');
      return null;
    case AccountAlreadyExists:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.AccountAlreadyExists',
      );
      return null;
    case KCamproxyBadRequest:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCamproxyBadRequest',
      );
      return null;
    case KCamproxyMissingToken:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCamproxyMissingToken',
      );
      return null;
    case KCamproxySDPRemoteOfferFailed:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCamproxySDPRemoteOfferFailed',
      );
      return null;
    case KCamproxySDPCreateAnswerFailed:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCamproxySDPCreateAnswerFailed',
      );
      return null;
    case KCamproxySDPLocalOfferFailed:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCamproxySDPLocalOfferFailed',
      );
      return null;
    case KCamproxyAddTrackFailed:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCamproxyAddTrackFailed',
      );
      return null;
    case KCamproxyNewLocalStaticFailed:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCamproxyNewLocalStaticFailed',
      );
      return null;
    case KCamproxyCamNotFound:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCamproxyCamNotFound',
      );
      return null;
    case KCamproxyCreatePeerConnFailed:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCamproxyCreatePeerConnFailed',
      );
      return null;
    case KPandaMissingFieldDomainOrUser:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KPandaMissingFieldDomainOrUser',
      );
      return null;
    case KPandaBadRequest:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.KPandaBadRequest');
      return null;
    case KPandaInternalServer:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KPandaInternalServer',
      );
      return null;
    case KPandaCamproxyNotFound:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KPandaCamproxyNotFound',
      );
      return null;
    case KPandaCamNotFound:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.KPandaCamNotFound');
      return null;
    case KCheetahBadRequest:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCheetahBadRequest',
      );
      return null;
    case KCheetahNvrNotFound:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCheetahNvrNotFound',
      );
      return null;
    case KCheetahSendReqFailed:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCheetahSendReqFailed',
      );
      return null;
    case KCheetahInternalServerError:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KCheetahInternalServerError',
      );
      return null;
    case KControllerBadRequest:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KControllerBadRequest',
      );
      return null;
    case KControllerForbidden:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KControllerForbidden',
      );
      return null;
    case KControllerNotFound:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KControllerNotFound',
      );
      return null;
    case KControllerDuplicate:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KControllerDuplicate',
      );
      return null;
    case KControllerCannotDelete:
      const groupname = message.substring(
        message.indexOf('delete ') + 7,
        message.indexOf(' with uuid'),
      );
      const usedby_uuid = message.substring(message.indexOf('used by ') + 8, message.indexOf('.'));
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        { id: 'error.KControllerCannotDelete', params: { item: groupname, usedby: usedby_uuid } },
      );
      return null;
    case KControllerInternalServerError:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KControllerInternalServerError',
      );
      return null;
    case KLionBadRequest:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.KLionBadRequest');
      return null;
    case KLionPlaybackNotFound:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KLionPlaybackNotFound',
      );
      return null;
    case KLionSendReqFailed:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KLionSendReqFailed',
      );
      return null;
    case KLionInternalServerError:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KLionInternalServerError',
      );
      return null;
    case KLionInternalFileNotFound:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KLionInternalFileNotFound',
      );
      return null;
    case KPlaybackBadRequest:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KPlaybackBadRequest',
      );
      return null;
    case KPlaybackExistToken:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.KPlaybackExistToken',
      );
      return null;
    case FAILED:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.FAILED');
      return null;
    case COMING_SOON:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.COMING_SOON');
      return null;
    case AUTHZ_NO_RESPONSE:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.AUTHZ_NO_RESPONSE');
      return null;
    case MISSING_PARAMS:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.MISSING_PARAMS');
      return null;
    case CAMERA_ID_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.CAMERA_ID_MISSING');
      return null;
    case DIRECTION_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.DIRECTION_MISSING');
      return null;
    case ISSTOP_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.ISSTOP_MISSING');
      return null;
    case SPEED_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.SPEED_MISSING');
      return null;
    case PRESET_ID_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PRESET_ID_MISSING');
      return null;
    case PRESET_TOUR_ID_MISSING:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.PRESET_TOUR_ID_MISSING',
      );
      return null;
    case LIST_POINT_MISSING:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.LIST_POINT_MISSING',
      );
      return null;
    case TIME_DELAY_MISSING:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.TIME_DELAY_MISSING',
      );
      return null;
    case NAME_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.NAME_MISSING');
      return null;
    case IP_STRIP_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.IP_STRIP_MISSING');
      return null;
    case PTZ_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PTZ_MISSING');
      return null;
    case PTZ_KEY_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PTZ_KEY_MISSING');
      return null;
    case ZONE_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.ZONE_MISSING');
      return null;
    case VENDOR_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.VENDOR_MISSING');
      return null;
    case CAMERA_ID_OUT_OF_RANGE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.CAMERA_ID_OUT_OF_RANGE',
      );
      return null;
    case DIRECTION_OUT_OF_RANGE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.DIRECTION_OUT_OF_RANGE',
      );
      return null;
    case ISSTOP_OUT_OF_RANGE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.ISSTOP_OUT_OF_RANGE',
      );
      return null;
    case SPEED_OUT_OF_RANGE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.SPEED_OUT_OF_RANGE',
      );
      return null;
    case PRESET_ID_OUT_OF_RANGE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.PRESET_ID_OUT_OF_RANGE',
      );
      return null;
    case PRESET_TOUR_ID_OUT_OF_RANGE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.PRESET_TOUR_ID_OUT_OF_RANGE',
      );
      return null;
    case LIST_POINT_OUT_OF_RANGE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.LIST_POINT_OUT_OF_RANGE',
      );
      return null;
    case TIME_DELAY_OUT_OF_RANGE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.TIME_DELAY_OUT_OF_RANGE',
      );
      return null;
    case NAME_OUT_OF_RANGE:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.NAME_OUT_OF_RANGE');
      return null;
    case IP_STRIP_OUT_OF_RANGE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.IP_STRIP_OUT_OF_RANGE',
      );
      return null;
    case ZONE_OUT_OF_RANGE:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.ZONE_OUT_OF_RANGE');
      return null;
    case PAGE_OUT_OF_RANGE:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PAGE_OUT_OF_RANGE');
      return null;
    case SIZE_OUT_OF_RANGE:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.SIZE_OUT_OF_RANGE');
      return null;
    case USER_OUT_OF_RANGE:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.USER_OUT_OF_RANGE');
      return null;
    case PTZ_EXIST:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PTZ_EXIST');
      return null;
    case PTZ_BUSY:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PTZ_BUSY');
      return null;
    case SYSTEM_BUSY:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.SYSTEM_BUSY');
      return null;
    case PTZ_FAILSE:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PTZ_FAILSE');
      return null;
    case PTZ_CAMERA_NO_CONNECT:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.PTZ_CAMERA_NO_CONNECT',
      );
      return null;
    case PTZ_PRESET_NO_EXIST:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.PTZ_PRESET_NO_EXIST',
      );
      return null;
    case PTZ_PRESET_OUT_OF_RANGE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.PTZ_PRESET_OUT_OF_RANGE',
      );
      return null;
    case PTZ_NO_SUPPORT:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PTZ_NO_SUPPORT');
      return null;
    case PTZ_NO_EXIST:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PTZ_NO_EXIST');
      return null;
    case PTZ_CONNECTED_NOT_EXIST:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.PTZ_CONNECTED_NOT_EXIST',
      );
      return null;
    case PTZ_NOT_RESPONSE:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PTZ_NOT_RESPONSE');
      return null;
    case PTZ_CANT_READ_RESPONSE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.PTZ_CANT_READ_RESPONSE',
      );
      return null;
    case PTZ_LOGIN_FAILSE:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PTZ_LOGIN_FAILSE');
      return null;
    case PTZ_PARAM_MISSING:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.PTZ_PARAM_MISSING');
      return null;
    case PTZ_ACTION_MISSING:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.PTZ_ACTION_MISSING',
      );
      return null;
    case CANT_INSERT_DATABASE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.CANT_INSERT_DATABASE',
      );
      return null;
    case CANT_UPDATE_DATABASE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.CANT_UPDATE_DATABASE',
      );
      return null;
    case CANT_DELETE_DATABASE:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.CANT_DELETE_DATABASE',
      );
      return null;
    case ISAPI_CANT_FIND_CHANEL:
      notify(
        'error',
        { id: 'noti.error_code', params: { code: code } },
        'error.ISAPI_CANT_FIND_CHANEL',
      );
      return null;
    case SCAN_EMPTY:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.SCAN_EMPTY');
      return null;
    case SCAN_FAILED:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.SCAN_FAILED');
      return null;
    default:
      notify('error', { id: 'noti.error_code', params: { code: code } }, 'error.Unknown');
      return null;
  }
};
export default HandleErrorCode;
