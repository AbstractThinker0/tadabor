import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="container vh-100 mw-100">
      <div className="h-100">
        <Navbar />
        <AlertMessage />
        {children}
      </div>
    </div>
  );
}

const AlertMessage = () => {
  return (
    <div
      className="alert alert-warning alert-dismissible fade show d-flex justify-content-center mt-2"
      role="alert"
    >
      هذه نسخة تجريبيّة من الموقع، الرجاء إبقاء نسخة إحتياط لكل ما تكتبه هنا.
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          تدبر
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav  mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                الرئيسية
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                حول الموقع
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Layout;
