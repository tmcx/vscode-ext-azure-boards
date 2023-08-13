import { ExtensionContext } from "vscode";
import { GLOBAL_STATE } from "./constant";

export class GlobalState {
  constructor(private context: ExtensionContext) {}

  get organizationName() {
    return this.context.globalState.get(GLOBAL_STATE.KEY.ORGANIZATION) || "";
  }
  get patToken() {
    return this.context.globalState.get(GLOBAL_STATE.KEY.PAT_TOKEN) || "";
  }
  get mail() {
    return this.context.globalState.get(GLOBAL_STATE.KEY.MAIL) || "";
  }
  get projectName() {
    return this.context.globalState.get(GLOBAL_STATE.KEY.PROJECT) || "";
  }
  get subAreaId() {
    return this.context.globalState.get(GLOBAL_STATE.KEY.AREA) || "";
  }
  get areaPath() {
    return this.context.globalState.get(GLOBAL_STATE.KEY.AREA_PATH) || "";
  }
  get baseUrl() {
    return "https://dev.azure.com";
  }

  set organizationName(organizationName: string) {
    this.context.globalState.setKeysForSync([GLOBAL_STATE.KEY.ORGANIZATION]);
    this.context.globalState.update(
      GLOBAL_STATE.KEY.ORGANIZATION,
      organizationName
    );
  }
  set patToken(patToken: string) {
    this.context.globalState.setKeysForSync([GLOBAL_STATE.KEY.PAT_TOKEN]);
    this.context.globalState.update(GLOBAL_STATE.KEY.PAT_TOKEN, patToken);
  }
  set mail(mail: string) {
    this.context.globalState.setKeysForSync([GLOBAL_STATE.KEY.MAIL]);
    this.context.globalState.update(GLOBAL_STATE.KEY.MAIL, mail);
  }
  set projectName(projectName: string) {
    this.context.globalState.setKeysForSync([GLOBAL_STATE.KEY.PROJECT]);
    this.context.globalState.update(GLOBAL_STATE.KEY.PROJECT, projectName);
  }
  set subAreaId(subAreaId: string) {
    this.context.globalState.setKeysForSync([GLOBAL_STATE.KEY.AREA]);
    this.context.globalState.update(GLOBAL_STATE.KEY.AREA, subAreaId);
  }
  set areaPath(areaPath: string) {
    this.context.globalState.setKeysForSync([GLOBAL_STATE.KEY.AREA_PATH]);
    this.context.globalState.update(GLOBAL_STATE.KEY.AREA_PATH, areaPath);
  }

  clear() {
    this.organizationName = "";
    this.projectName = "";
    this.subAreaId = "";
    this.areaPath = "";
    this.patToken = "";
    this.mail = "";
  }
}
