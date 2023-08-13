import { CMD_WORK_ITEM_DETAILS } from "../commands/work-items-details";
import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { IWorkItem } from "../interfaces/azure";

export class WorkItemTreeItem extends TreeItem {
  constructor(private workItem: IWorkItem) {
    super("");
    this.collapsibleState = TreeItemCollapsibleState.None;
    this.setLabels();
    this.setCommand();
  }

  private setCommand() {
    this.command = {
      title: String(this.tooltip),
      command: CMD_WORK_ITEM_DETAILS.id,
      arguments: [this.workItem],
    };
  }

  private setLabels() {
    const { "System.Title": title, "System.State": state } =
      this.workItem.fields;
    this.description = title;
    this.label = `[${state}]`;
    this.tooltip = `[${state}] ${title}`;
  }
}
