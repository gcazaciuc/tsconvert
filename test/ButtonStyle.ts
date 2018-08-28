import { style } from "typestyle";
export const btn = style({
  color: "#ffffff",
  marginBottom: "35px",
  position: "relative",
  $debugName: "btn",
  $nest: {
    "&:hover": { opacity: "0.8", color: "#ffffff" },
    "&:focus": { boxShadow: "none" },
    "&::before": { content: "'.'" }
  }
});
export const btnCGrey = style({
  borderColor: "#d8dbe6",
  $debugName: "btnCGrey",
  $nest: { "&:hover": { color: "inherit" } }
});
export const btnDisabled = style({
  backgroundColor: "#9a9fbf",
  borderColor: "#9a9fbf",
  $debugName: "btnDisabled"
});
