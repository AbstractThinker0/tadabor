import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <div
      className="alert alert-warning alert-dismissible fade show d-flex justify-content-center mt-2"
      role="alert"
    >
      {t("alert_message")}
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
  const { t, i18n } = useTranslation();

  document.body.dir = i18n.dir();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          {t("nav_brand")}
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
          <ul
            className={`navbar-nav  mb-2 mb-lg-0 ${
              i18n.resolvedLanguage === "en" && "me-auto"
            }`}
          >
            <li className="nav-item">
              <Link className="nav-link" aria-current="page" to="/">
                {t("nav_home")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                {t("nav_about")}
              </Link>
            </li>
          </ul>
          <div
            className={`d-flex ${i18n.resolvedLanguage === "ar" && "me-auto"}`}
          >
            <button
              key={"en"}
              style={{
                fontWeight: i18n.resolvedLanguage === "en" ? "bold" : "normal",
              }}
              onClick={() => i18n.changeLanguage("en")}
            >
              English
            </button>
            <button
              key={"ar"}
              style={{
                fontWeight: i18n.resolvedLanguage === "ar" ? "bold" : "normal",
              }}
              onClick={() => i18n.changeLanguage("ar")}
            >
              Arabic
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Layout;
