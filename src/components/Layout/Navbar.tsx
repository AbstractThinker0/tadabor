import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageButton from "./LanguageButton";

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav>
      <div className="nav-list">
        <div className="nav-list-start">
          <NavItem to="/" label={t("nav_browser")} />
          <NavItem to="/roots" label={t("nav_roots")} />
          <NavItem to="/notes" label={t("nav_notes")} />
          <NavItem to="/translation" label={t("nav_translation")} />
          <NavItem to="/coloring" label={t("nav_coloring")} />
          <NavItem to="/tags" label={t("nav_tags")} />
          <NavItem to="/inspector" label={t("nav_inspector")} />
          <NavItem to="/comparator" label={t("nav_comparator")} />
          <NavItem to="/searcher" label={t("nav_searcher")} />
          <NavItem to="/about" label={t("nav_about")} />
        </div>
        <div className="nav-list-end">
          <LanguageButton />
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  label: string;
  to: string;
}

const NavItem = ({ label, to }: NavItemProps) => {
  return (
    <div className="nav-list-start-item">
      <NavLink to={to}>{label}</NavLink>
    </div>
  );
};

export default Navbar;
