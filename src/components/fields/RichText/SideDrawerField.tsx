import { Controller } from "react-hook-form";
import { ISideDrawerFieldProps } from "../types";
import RichTextEditor from "components/RichTextEditor";

export default function RichText({
  control,
  column,
  disabled,
}: ISideDrawerFieldProps) {
  return (
    <Controller
      control={control}
      name={column.key}
      render={({ onChange, value }) => (
        <RichTextEditor
          disabled={disabled}
          value={value}
          onChange={onChange}
          id={`sidedrawer-field-${column.key}`}
        />
      )}
    />
  );
}
