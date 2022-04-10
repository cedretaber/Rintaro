export type AlertType = "error" | "warning" | "info" | "success";

type Alert = {
  type: AlertType;
  body: string;
};

export default Alert;
