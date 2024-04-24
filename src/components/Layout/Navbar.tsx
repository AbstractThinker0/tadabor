import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const { t } = useTranslation();

  useEffect(() => {
    async function storagePersist() {
      if (
        !navigator.storage ||
        !navigator.storage.persisted ||
        !navigator.storage.persist
      )
        return;

      const isPersisted = await navigator.storage.persisted();

      if (!isPersisted) {
        navigator.storage.persist();
      }
    }

    storagePersist();
  }, []);

  return (
    <nav>
      <div className="nav-list">
        <div className="nav-list-start">
          <NavItem to="/" label={t("nav_browser")} />
          <NavItem to="/roots" label={t("nav_roots")} />
          <NavItem to="/translation" label={t("nav_translation")} />
          <NavItem to="/notes" label={t("nav_notes")} />
          <NavItem to="/coloring" label={t("nav_coloring")} />
          <NavItem to="/tags" label={t("nav_tags")} />
          <NavItem to="/inspector" label={t("nav_inspector")} />
          <NavItem to="/comparator" label={t("nav_comparator")} />
          <NavItem to="/searcher" label={t("nav_searcher")} />
          <NavItem to="/searcher2" label={t("nav_searcher") + " 2"} />
          <NavItem to="/about" label={t("nav_about")} />
        </div>
        <div className="nav-list-end">
          <SettingsButton />
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

const SettingsButton = () => {
  return (
    <span
      className="nav-settings-button"
      data-bs-toggle="modal"
      data-bs-target="#settingsModal"
    >
      ⚙️
    </span>
  );
};

export default Navbar;
