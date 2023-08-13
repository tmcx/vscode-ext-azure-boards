import { globalState } from "../extension";
import { ICommand } from "../interfaces/extension-configurator";
import { TDP_MY_WORK_ITEMS } from "../tree-data-providers/my-work-items";
import { WEBVIEW_SET_CONFIGURATION } from "../web-views/set-configuration";

export const CMD_CLEAR_CONFIGURATION: ICommand = {
  id: "cmd-clear-configuration",
  callback: () => {
    globalState.clear();
    WEBVIEW_SET_CONFIGURATION?.instance?.loadView();
    TDP_MY_WORK_ITEMS.tdp.refresh();
  },
};
