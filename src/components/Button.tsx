import { Button } from "@/design/ui/button";

import { ComponentBase, UIComponent } from "../types";

import { renderItems } from "../helpers/render";

export interface ButtonComponent extends ComponentBase {
  type: "button";
  children: UIComponent[];
}

export const ButtonDemo = (props: ButtonComponent) => {
  return <Button {...props.props}>{renderItems(props.children)}</Button>;
};
