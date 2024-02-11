import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

import { ComponentBase, UIComponent } from "../types";

import { renderItem } from "../helpers/render";

export interface AccordionComponent extends ComponentBase {
  type: "accordion";
  accordionType: "single" | "multiple";
  collapsible: boolean;
  items: {
    label: UIComponent;
    content: UIComponent;
  }[];
}

export const AccordionDemo = (props: AccordionComponent) => {
  return (
    <Accordion type="single" collapsible={true}>
      {props.items.map((item, index) => {
        return (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{renderItem(item.label)}</AccordionTrigger>
            <AccordionContent>{renderItem(item.content)}</AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
