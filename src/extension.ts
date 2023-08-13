import { CMD_REFRESH_MY_WORK_ITEMS } from "./commands/refresh-my-work-items";
import { TDP_MY_WORK_ITEMS } from "./tree-data-providers/my-work-items";
import { WEBVIEW_SET_CONFIGURATION } from "./web-views/set-configuration";
import { CMD_WORK_ITEM_DETAILS } from "./commands/work-items-details";
import { ExtensionConfigurator } from "./config/extension-configurator";
import { GlobalState } from "./config/global-state";
import { ExtensionContext } from "vscode";
import { CMD_CLEAR_CONFIGURATION } from "./commands/clear-configuration";

export let globalState: GlobalState;

export function activate(context: ExtensionContext) {
  globalState = new GlobalState(context);
  const extConf = new ExtensionConfigurator(context);

  extConf.registerTreeDataProvider(TDP_MY_WORK_ITEMS.id, TDP_MY_WORK_ITEMS.tdp);
  extConf.registerCommand(
    CMD_WORK_ITEM_DETAILS.id,
    CMD_WORK_ITEM_DETAILS.callback
  );
  extConf.registerCommand(
    CMD_REFRESH_MY_WORK_ITEMS.id,
    CMD_REFRESH_MY_WORK_ITEMS.callback
  );

  extConf.registerWebviewViewProvider(
    WEBVIEW_SET_CONFIGURATION.id,
    WEBVIEW_SET_CONFIGURATION.wvp
  );
  extConf.registerCommand(
    CMD_CLEAR_CONFIGURATION.id,
    CMD_CLEAR_CONFIGURATION.callback
  );
}

export function deactivate() {}
