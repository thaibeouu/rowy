import { useState } from "react";
import _get from "lodash/get";
import { useSnackbar } from "notistack";

import { Fab, FabProps, CircularProgress } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import UndoIcon from "@mui/icons-material/Undo";

import { useProjectContext } from "contexts/ProjectContext";
import { cloudFunction } from "firebase/callables";
import { formatPath } from "utils/fns";
import { useConfirmation } from "components/ConfirmationDialog";
import { useActionParams } from "./FormDialog/Context";
import { runRoutes } from "constants/runRoutes";

const replacer = (data: any) => (m: string, key: string) => {
  const objKey = key.split(":")[0];
  const defaultValue = key.split(":")[1] || "";
  return _get(data, objKey, defaultValue);
};

const getStateIcon = (actionState) => {
  switch (actionState) {
    case "undo":
      return <UndoIcon />;
    case "redo":
      return <RefreshIcon />;
    default:
      return <PlayIcon />;
  }
};

export interface IActionFabProps extends Partial<FabProps> {
  row: any;
  column: any;
  onSubmit: (value: any) => void;
  value: any;
  disabled: boolean;
}

export default function ActionFab({
  row,
  column,
  onSubmit,
  value,
  disabled,
  ...props
}: IActionFabProps) {
  const { requestConfirmation } = useConfirmation();
  const { enqueueSnackbar } = useSnackbar();
  const { requestParams } = useActionParams();
  const { tableState, rowyRun } = useProjectContext();
  const { ref } = row;
  const { config } = column as any;

  const action = !value
    ? "run"
    : value.undo
    ? "undo"
    : value.redo
    ? "redo"
    : "";
  const [isRunning, setIsRunning] = useState(false);

  const callableName: string =
    (column as any).callableName ?? config.callableName ?? "actionScript";
  const handleRun = async (actionParams = null) => {
    if (!rowyRun) return;
    setIsRunning(true);

    const data = {
      ref: { path: ref.path, id: ref.id, tablePath: window.location.pathname },
      column: { ...column, editor: undefined },
      action,
      schemaDocPath: formatPath(tableState?.tablePath ?? ""),
      actionParams,
    };

    const resp = await rowyRun({
      route: runRoutes.actionScript,
      body: data,
      params: [],
    });
    const { message, success } = resp;
    setIsRunning(false);
    enqueueSnackbar(JSON.stringify(message), {
      variant: success ? "success" : "error",
    });

    // cloudFunction(
    //   callableName,
    //   data,
    //   async (response) => {
    //     const { message, cellValue, success } = response.data;
    //     setIsRunning(false);
    //     enqueueSnackbar(JSON.stringify(message), {
    //       variant: success ? "success" : "error",
    //     });
    //   },
    //   (error) => {
    //     console.error("ERROR", callableName, error);
    //     setIsRunning(false);
    //     enqueueSnackbar(JSON.stringify(error), { variant: "error" });
    //   }
    // );
  };
  const hasRan = value && value.status;

  const actionState: "run" | "undo" | "redo" = hasRan
    ? value.undo
      ? "undo"
      : "redo"
    : "run";

  const needsParams = Array.isArray(config.params) && config.params.length > 0;
  const needsConfirmation =
    typeof config.confirmation === "string" && config.confirmation !== "";
  return (
    <Fab
      onClick={
        needsParams
          ? () =>
              requestParams({
                column,
                row,
                handleRun,
              })
          : needsConfirmation
          ? () =>
              requestConfirmation({
                title: `${column.name as string} Confirmation`,
                body: (actionState === "undo" && config.undoConfirmation
                  ? config.undoConfirmation
                  : config.confirmation
                ).replace(/\{\{(.*?)\}\}/g, replacer(row)),
                confirm: "Run",
                handleConfirm: () => handleRun(),
              })
          : () => handleRun()
      }
      disabled={
        isRunning ||
        !!(
          hasRan &&
          (config.redo?.enabled ? false : !value.redo) &&
          (config.undo?.enabled ? false : !value.undo)
        ) ||
        disabled
      }
      size="small"
      sx={{
        "&:not(.MuiFab-primary):not(.MuiFab-secondary):not(.Mui-disabled)": {
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? undefined
              : theme.palette.background.default,
        },
      }}
      {...props}
    >
      {isRunning ? (
        <CircularProgress color="secondary" size={16} thickness={5.6} />
      ) : (
        getStateIcon(actionState)
      )}
    </Fab>
  );
}
