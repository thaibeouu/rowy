import { lazy } from "react";
import { IFieldConfig, FieldType } from "components/fields/types";
import withHeavyCell from "../_withTableCell/withHeavyCell";
import { parse, format } from "date-fns";
import { DATE_FORMAT } from "constants/dates";

import DateIcon from "@mui/icons-material/TodayOutlined";
import BasicCell from "./BasicCell";
import NullEditor from "components/Table/editors/NullEditor";

const TableCell = lazy(
  () => import("./TableCell" /* webpackChunkName: "TableCell-Date" */)
);
const SideDrawerField = lazy(
  () =>
    import("./SideDrawerField" /* webpackChunkName: "SideDrawerField-Date" */)
);
const Settings = lazy(
  () => import("./Settings" /* webpackChunkName: "Settings-Date" */)
);

export const config: IFieldConfig = {
  type: FieldType.date,
  name: "Date",
  group: "Date & Time",
  dataType: "firebase.firestore.Timestamp",
  initialValue: null,
  initializable: true,
  icon: <DateIcon />,
  description: `Date displayed by default as ${DATE_FORMAT}.`,
  TableCell: withHeavyCell(BasicCell, TableCell),
  TableEditor: NullEditor as any,
  SideDrawerField,
  settings: Settings,
  csvImportParser: (value, config) =>
    parse(value, config?.format ?? DATE_FORMAT, new Date()),
  csvExportFormatter: (value: any, config?: any) =>
    format(value.toDate(), config?.format ?? DATE_FORMAT),
};
export default config;

export { DateIcon };
