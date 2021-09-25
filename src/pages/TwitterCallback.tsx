import { useLocation } from "react-router-dom";

import Navigation, { APP_BAR_HEIGHT } from "components/Navigation";
import EmptyState from "components/EmptyState";

import { db } from "../firebase";
import { useAppContext } from "contexts/AppContext";
import { useEffect } from "react";

export default function TwitterCallbackPage() {
  const { currentUser } = useAppContext();
  const query = new URLSearchParams(useLocation().search);
  const oauthToken = query.get("oauth_token");
  const oauthVerifier = query.get("oauth_verifier");

  useEffect(() => {
    if (currentUser?.email && oauthToken && oauthVerifier) {
      db.collection("twitter_auth")
        .doc(currentUser.email)
        .set(
          {
            oauth_token: query.get("oauth_token"),
            oauth_verifier: query.get("oauth_verifier"),
          },
          { merge: true }
        )
        .then(() => {
          window.close();
        });
    }
  }, [currentUser, oauthToken, oauthVerifier, db]);

  return (
    <Navigation title="Please wait..." titleComponent={() => <div />}>
      <EmptyState
        message="Please wait..."
        fullScreen
        style={{ marginTop: -APP_BAR_HEIGHT }}
      />
    </Navigation>
  );
}
