import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QuranProvider } from "../../context/QuranContext";
import "../../styles/main.scss";
import { ReactNode, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import AlertMessage from "./AlertMessage";

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

export default Layout;
