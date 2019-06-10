import React, { useState, useEffect, Fragment } from "react";
import Toaster from "./Toaster";

const UpdateCheck = ({ appServiceWorker, setUpdate }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    appServiceWorker.onUpdateFound(() => {
      setShow(true);
      // setUpdate(true);
    });
  });

  return (
    <Fragment>
      {show && (
        <Fragment>
          <div className="overlay" />
          <Toaster
            content="Nueva actualizacion!"
            close={() => setShow(false)}
            ok={() => window.location.reload()}
            cClass="update-check"
          />
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateCheck;
