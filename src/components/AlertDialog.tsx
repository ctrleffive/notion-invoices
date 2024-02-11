import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/design/ui/alert-dialog";

import { ComponentBase, UIComponent } from "../types";

import { renderItem } from "../helpers/render";

export interface AlertDialogComponent extends ComponentBase {
  type: "alert";
  trigger: UIComponent;
}

export const AlertDialogDemo = (props: AlertDialogComponent) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{renderItem(props.trigger)}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
