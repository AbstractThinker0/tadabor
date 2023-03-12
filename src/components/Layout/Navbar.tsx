import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageButton from "./LanguageButton";

const Navbar = () => {
  const { t, i18n } = useTranslation();

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
              <Link className="nav-link" to="/roots">
                {t("nav_roots")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/notes">
                {t("nav_notes")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/translation">
                {t("nav_translation")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/coloring">
                {t("nav_coloring")}
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                {t("nav_about")}
              </Link>
            </li>
          </ul>
          <LanguageButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
