import { Form } from "react-router-dom";
import Wrapper from "../../../assets/wrappers/RegisterAndLoginPage";
import FormRow from "../../../components/layout-dashboard/FormRow";
import SubmitBtn from "../../../components/layout-dashboard/SubmitBtn";
import Logo from "../../../components/layout-dashboard/Logo";

const Login = () => {
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />

        <SubmitBtn />
      </Form>
    </Wrapper>
  );
};
export default Login;
