import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="lg:px-8 px-5 w-full py-5 flex justify-between items-center">
      <Link to={"/"}>
        <h1 className="text-xl font-semibold">Volatext</h1>
      </Link>
      {/* <button className="btn">Moon</button> */}
    </div>
  );
};

export default Navbar;
