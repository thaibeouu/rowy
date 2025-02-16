import { Link } from "react-router-dom";

import { Typography, Link as MuiLink, Button } from "@mui/material";
import SecurityIcon from "@mui/icons-material/SecurityOutlined";

import EmptyState from "components/EmptyState";

import { WIKI_LINKS } from "constants/externalLinks";
import routes from "constants/routes";
import { useAppContext } from "@src/contexts/AppContext";

export default function AccessDenied() {
  const { currentUser } = useAppContext();
  return (
    <EmptyState
      fullScreen
      Icon={SecurityIcon}
      message="Access Denied"
      description={
        <>
          <Typography>
            You are currently signed in as {currentUser?.email}
          </Typography>
          <Typography>
            You do not have access to this project. Please contact the project
            owner.
          </Typography>
          <Typography>
            If you are the project owner, please follow{" "}
            <MuiLink
              href={WIKI_LINKS.securityRules}
              target="_blank"
              rel="noopener noreferrer"
            >
              these instructions
            </MuiLink>{" "}
            to set up this project’s security rules.
          </Typography>

          <Button component={Link} to={routes.signOut}>
            Sign Out
          </Button>
        </>
      }
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "background.default",
        zIndex: 9999,
      }}
    />
  );
}
