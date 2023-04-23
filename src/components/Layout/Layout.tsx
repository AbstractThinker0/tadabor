import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QuranProvider } from "../../context/QuranContext";
import "../../styles/main.scss";
import { ReactNode, useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";

interface Props {
  children?: ReactNode;
}

function Layout({ children }: Props) {
  const mainRef = useRef<HTMLElement>(null);
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.dir = i18n.dir();
    }
  }, [i18n.resolvedLanguage, i18n]);

  return (
    <main ref={mainRef}>
      <Navbar />
      <AlertMessage />
      <QuranProvider>{children}</QuranProvider>
      <ToastContainer
        position={`${isRtl ? "top-left" : "top-right"}`}
        rtl={isRtl}
      />
    </main>
  );
}

const AlertMessage = () => {
  const localStorageBetaKey = "betaNotified";

  const [betaNotified, setBetaNotified] = useState(
    localStorage.getItem(localStorageBetaKey) !== null
  );
  const { t } = useTranslation();

  function onClickClose() {
    localStorage.setItem(localStorageBetaKey, "true");
    setBetaNotified(true);
  }

  if (betaNotified) return <></>;

  return (
    <div
      className="alert alert-warning alert-dismissible fade show d-flex justify-content-center m-0"
      role="alert"
    >
      {t("alert_message")}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClickClose}
      ></button>
    </div>
  );
};

export default Layout;
