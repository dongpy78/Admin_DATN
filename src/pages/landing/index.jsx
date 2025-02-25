import { Link } from "react-router-dom";
import Wrapper from "../../assets/wrappers/LandingPage";
import main from "../../assets/images/main.svg";
import { Logo } from "../../components/layout-dashboard";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis
            veritatis exercitationem iusto eligendi nemo impedit. Quibusdam sit
            quia odit rerum laudantium aut eos! Non explicabo dolorem ea
            commodi, temporibus porro.
          </p>
          <Link to="/auth/login" className="btn">
            Login / Admin
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
