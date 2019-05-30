import React, { useEffect, useState } from "react";
import PasswordlessSigning from "./PasswordlessSigning";
import { firebaseAppAuth } from "./../../firebase/firebaseConfig";
import { GoogleSVG, LogoSVG } from "./../Icons";
import StatusMsg from "./StatusMsg";

const LoginScreen = ({ signInWithGoogle, props, user }) => {
  const [sending, setSending] = useState(false);
  const [backFromEmail, setBackFromEmail] = useState(false);
  const [statusMsg, setStatusMsg] = useState({
    content: "",
    color: "",
    visibility: false
  });

  useEffect(() => {
    if (user) {
      props.history.push("/");
    } else {
      const params = new URLSearchParams(props.location.search);
      if (params.get("apiKey")) {
        fromEmail();
      }
    }
  }, []);

  const singingWithPasswordless = email => {
    setSending(true);
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: "https://qbigtime.surge.sh/login",
      // This must be true.
      handleCodeInApp: true
    };

    firebaseAppAuth
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);
        setSending(false);
        setStatusMsg({
          content:
            "El envio fue exitoso. Recibiras un email con las instrucciones para continuar con tu ingreso.",
          color: "green",
          visibility: true
        });
      })
      .catch(function(error) {
        // Some error occurred, you can inspect the code: error.code
        setStatusMsg({
          content: "Error al enviar, por favor reintente.",
          color: "red",
          visibility: true
        });
        setSending(false);
      });
  };

  const fromEmail = () => {
    setBackFromEmail(true);
    setStatusMsg({
      content: "Estamos verificando tus datos. En segundos te redirigiremos.",
      color: "neutral",
      visibility: true
    });
    // Confirm the link is a sign-in with email link.
    if (firebaseAppAuth.isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      var email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
      }
      // The client SDK will parse the code from the link for you.

      firebaseAppAuth
        .signInWithEmailLink(email, window.location.href)
        .then(function(result) {
          // Clear email from storage.
          window.localStorage.removeItem("emailForSignIn");
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          setStatusMsg({
            content: "Datos correctos, bienvenido!!",
            color: "green",
            visibility: true
          });
          if (user) {
            props.history.push("/");
          }
        })
        .catch(function(error) {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  };

  return (
    <div className="login">
      <LogoSVG />
      {!backFromEmail ? (
        <React.Fragment>
          <div>Bienvenido</div>
          {statusMsg.visibility && (
            <StatusMsg content={statusMsg.content} color={statusMsg.color} />
          )}
          <PasswordlessSigning
            sendEmail={email => singingWithPasswordless(email)}
            sending={sending}
          />
          <button
            className="btn btn-wide btn-google"
            onClick={() => signInWithGoogle()}
          >
            <span className="btn-wide-body-w-icon">
              <GoogleSVG />
              <span>INGRESAR CON GOOGLE</span>
            </span>
          </button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div>Gracias por volver</div>
          <StatusMsg content={statusMsg.content} color={statusMsg.color} />
        </React.Fragment>
      )}
    </div>
  );
};

export default LoginScreen;