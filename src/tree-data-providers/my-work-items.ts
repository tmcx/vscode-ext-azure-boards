import { WorkItemTreeItem } from "../tree-items/work-item";
import {
  WorkItemTypeTreeItem,
  WorkItemTypes,
} from "../tree-items/work-item-types";
import { ITreeDataProvider } from "../interfaces/extension-configurator";
import { Event, EventEmitter, TreeDataProvider, TreeItem } from "vscode";
import { AzureService } from "../service/azure";

class MyWorkItemsTreeDataProvider implements TreeDataProvider<unknown> {
  private azureService: AzureService;

  constructor() {
    this.azureService = new AzureService();
  }

  async getTreeItem(workItem: TreeItem): Promise<any> {
    return workItem;
  }

  async getChildren(element?: WorkItemTypeTreeItem): Promise<TreeItem[]> {
    if (element) {
      const workItems = await this.azureService.getMyWorkItems({
        type: element.type,
      });
      return workItems.map((workItem) => new WorkItemTreeItem(workItem));
    }
    return new WorkItemTypes().get();
  }

  private _onDidChangeTreeData: EventEmitter<TreeItem | undefined> =
    new EventEmitter<TreeItem | undefined>();

  readonly onDidChangeTreeData: Event<TreeItem | undefined> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}

export const TDP = new MyWorkItemsTreeDataProvider();
export const TDP_MY_WORK_ITEMS: ITreeDataProvider = {
  id: "tdp-my-work-items",
  tdp: TDP,
};
