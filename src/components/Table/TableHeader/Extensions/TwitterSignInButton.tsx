import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import { db } from "../../../../firebase";
import { useAppContext } from "contexts/AppContext";

const TwitterSignInButton = () => {
  const apiKey = process.env.REACT_APP_TWITTER_API_KEY;
  const apiSecret = process.env.REACT_APP_TWITTER_API_SECRET;
  const authURL =
    "https://australia-southeast1-fir-demo-2-e272f.cloudfunctions.net/twitterAuth";

  const { currentUser } = useAppContext();
  const [twitterSignedIn, setTwitterSignedIn] = useState<boolean>(false);

  const connect = () => {
    const popup = window.open("", "_blank");
    fetch(authURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: apiKey,
        secret: apiSecret,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (currentUser?.email) {
          if (popup) {
            popup.location.href = res.url;
          }
          db.collection("twitter_auth")
            .doc(currentUser.email)
            .set({ ...res, api_key: apiKey, api_secret: apiSecret })
            .then(() => setTwitterSignedIn(true));
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    if (currentUser?.email) {
      db.collection("twitter_auth")
        .doc(currentUser.email)
        .get()
        .then((res) => {
          if (!!res.get("oauth_verifier")) {
            setTwitterSignedIn(true);
          }
        });
    }
  }, [currentUser, db]);

  return (
    <Button
      size="small"
      endIcon={<TwitterIcon />}
      onClick={connect}
      /* disabled={signedIn} */
      style={{ flexShrink: 0 }}
    >
      {twitterSignedIn
        ? "Twitter signed in, click to re-auth"
        : "Sign in with Twitter"}
    </Button>
  );
};

export default TwitterSignInButton;
