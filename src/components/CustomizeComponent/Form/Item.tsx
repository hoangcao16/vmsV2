import { Form, FormItemProps } from "antd";

const getRulesForType = (type, props) => {
  switch (type) {
    case "input":
      return [
        { max: props.maxLength, message: 'max' },
        { min: props.minLength, message: 'min' },
        { required: props.required, message: 'require' }
      ]
    default:
      return []
  }
}

const MSItemInForm = ({ children, type, rules = [], ...props }: { children: any, type: "input" | "select" | string } & FormItemProps) => {
  return <Form.Item {...props} rules={[
    ...getRulesForType(type, props),
    ...rules,
  ]}>{children}</Form.Item>
}

export default MSItemInForm;