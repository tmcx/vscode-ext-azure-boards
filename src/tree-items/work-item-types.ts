import { TreeItem, TreeItemCollapsibleState } from "vscode";
import { WORK_ITEM } from "../config/constant";
import { join } from "path";
import { AzureService } from "../service/azure";
import { globalState } from "../extension";

export class WorkItemTypes {
  azureService: AzureService;

  constructor() {
    this.azureService = new AzureService();
  }

  async get(): Promise<WorkItemTypeTreeItem[]> {
    if (!globalState.patToken) {
      return [];
    }

    const groups: WorkItemTypeTreeItem[] = [];

    for (const type of WORK_ITEM.TYPES) {
      const ids = await this.azureService.getMyWorkItemIds({ type: type.name });
      const name = `[${ids.length}] ${type.name}`;
      groups.push(new WorkItemTypeTreeItem(name, type.name, type.icon));
    }

    return groups;
  }
}

export class WorkItemTypeTreeItem extends TreeItem {
  type: string;

  constructor(label: string, type: string, icon: string) {
    super(label);
    this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    this.type = type;
    this.iconPath = join(__dirname, "..", "..", "resources", `${icon}.svg`);
  }
}
