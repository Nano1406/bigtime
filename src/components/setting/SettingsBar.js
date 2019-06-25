import React from "react";
import PropTypes from "prop-types";
import localforage from "localforage";

import {
  MailSVG,
  CloseSVG,
  MoonSVG,
  SunSVG,
  RefreshSVG,
  TrashSVG,
  LogOutSVG
} from "../Icons";
import SettingItem from "./SettingItem";
import OutsideClick from "./../OutsideClick";

const SettingsBar = ({ data, actions, setShowSettings }) => {
  const { theme, bucle } = data;
  const { setTheme, toggleBucle, signOut, clearSong } = actions;

  const items = [
    {
      title: "Modo Oscuro",
      detail: "Puede activar el modo oscuro o el modo claro",
      action: setTheme,
      value: theme,
      buttonDetails: {
        toggle: true,
        checkedIcon: SunSVG,
        uncheckedIcon: MoonSVG
      }
    },
    {
      title: "Bucle",
      detail: "Al finalizar la pista volverá a reproducirse",
      action: toggleBucle,
      value: bucle,
      buttonDetails: {
        toggle: true
      }
    },
    {
      title: "Reiniciar",
      detail: "En caso de necesitarlo puede reiniciar la aplicación",
      action: () => window.location.reload(),
      value: false,
      buttonDetails: {
        toggle: false,
        checkedIcon: RefreshSVG
      }
    },
    {
      title: "Limpiar Almacenaje",
      detail:
        "Al limpiar el almacenaje la última pista seleccionada deberá ser cargada nuevamente",
      action: () => {
        localforage.clear();
        clearSong();
      },
      value: false,
      buttonDetails: {
        toggle: false,
        checkedIcon: TrashSVG
      }
    }
  ];

  return (
    <div className="setting-bar-container">
      <div className="overlay" />
      <OutsideClick action={() => setShowSettings(false)}>
        <div className="settings-bar">
          <header>
            <h2>Ajustes</h2>
            <button
              className="close-btn"
              onClick={() => setShowSettings(false)}
            >
              <CloseSVG />
            </button>
          </header>
          <div className="items-container">
            {items.map((item, i) => (
              <SettingItem item={item} key={i} />
            ))}
          </div>
          <div className="bottom-bar">
            <button>
              <MailSVG /> <span>Contacto</span>
            </button>
            <button onClick={signOut}>
              <LogOutSVG />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </OutsideClick>
    </div>
  );
};

export default SettingsBar;

SettingsBar.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  setShowSettings: PropTypes.func.isRequired
};
