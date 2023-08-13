import { WorkItemDetailsView } from "../web-views/work-item-details";
import { ICommand } from "../interfaces/extension-configurator";

export const CMD_WORK_ITEM_DETAILS: ICommand = {
  id: "cmd-work-item-details",
  callback: (content: any) => new WorkItemDetailsView().show(content),
};
