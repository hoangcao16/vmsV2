import { Form, FormItemProps } from 'antd';

const getRulesForType = (type, props) => {
  switch (type) {
    case 'input':
      return [
        { max: props.maxLength, message: `Tối đa ${props.maxLength} kí tự.` },
        { min: props.minLength, message: `Tối thiểu ${props.minLength} kí tự.` },
        { required: props.required, message: `Trường ${props.name} là bắt buộc.` },
      ];
    case 'select':
      return [{ required: props.required, message: `Trường ${props.name} là bắt buộc.` }];
    case 'email':
      return [
        { max: props.maxLength, message: `Tối đa ${props.maxLength} kí tự.` },
        { min: props.minLength, message: `Tối thiểu ${props.minLength} kí tự.` },
        { required: props.required, message: `Trường ${props.name} là bắt buộc.` },
        {
          pattern:
            /^[a-zA-Z0-9]+([\._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([\_-]?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,4}){1,2}$/,
          message: `Trường ${props.name} không đúng định dạng.`,
        },
      ];

    // case long_,lat_

    default:
      return [];
  }
};

const MSItemInForm = ({
  children,
  type,
  rules = [],
  ...props
}: { children: any; type: 'input' | 'select' | 'email' | string } & FormItemProps) => {
  return (
    <Form.Item {...props} rules={[...getRulesForType(type, props), ...rules]}>
      {children}
    </Form.Item>
  );
};

export default MSItemInForm;
