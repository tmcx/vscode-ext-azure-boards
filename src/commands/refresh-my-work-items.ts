import { ICommand } from "../interfaces/extension-configurator";
import { TDP_MY_WORK_ITEMS } from "../tree-data-providers/my-work-items";

export const CMD_REFRESH_MY_WORK_ITEMS: ICommand = {
  id: "cmd-refresh-my-work-items",
  callback: () => TDP_MY_WORK_ITEMS.tdp.refresh(),
};
