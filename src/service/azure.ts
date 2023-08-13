import { globalState } from "../extension";
import { HttpClientService } from "./http-client";
import {
  AzureRequestLevel,
  IArea,
  IComment,
  IProject,
  ITeam,
  IWorkItem,
  IWorkItemId,
} from "../interfaces/azure";

export class AzureService {
  httpClientService = new HttpClientService();

  async getComments(workItemId: number): Promise<{
    totalCount: number;
    count: number;
    comments: IComment[];
  }> {
    const baseUrl = this.getBaseUrl(AzureRequestLevel.project);
    const url = `${baseUrl}/_apis/wit/workItems/${workItemId}/comments?api-version=7.0-preview.3`;

    return this.httpClientService.get<{
      totalCount: number;
      count: number;
      comments: IComment[];
    }>(url);
  }

  async getMyWorkItems(filters?: { type?: string }): Promise<IWorkItem[]> {
    const workItemIds = await this.getMyWorkItemIds({ type: filters?.type });
    if (workItemIds.length === 0) {
      return [];
    }
    const baseUrl = this.getBaseUrl(AzureRequestLevel.project);
    const ids = workItemIds.join(",");
    const url = `${baseUrl}/_apis/wit/workItems?ids=${ids}&api-version=7.0`;
    return (await this.httpClientService.get<{ value: IWorkItem[] }>(url))
      ?.value;
  }

  async getMyWorkItemIds(filters?: { type?: string }): Promise<number[]> {
    let additionalFilters = "";
    if (filters?.type) {
      additionalFilters += ` AND [System.WorkItemType] = '${filters.type}'`;
    }
    if (globalState?.areaPath) {
      additionalFilters += ` AND [System.AreaPath] = '${globalState.areaPath}'`;
    }

    const baseUrl = this.getBaseUrl(AzureRequestLevel.organization);
    let url = `${baseUrl}/_apis/wit/wiql?api-version=7.1-preview.2&$top=10000`;

    const data = {
      query: `SELECT * FROM workitems WHERE [System.AssignedTo] = '${globalState.mail}' ${additionalFilters} ORDER BY [System.CreatedDate] DESC`,
    };
    const workItems = await this.httpClientService.post<{
      workItems: IWorkItemId[];
    }>(url, data);
    if (workItems.workItems.length > 0) {
      return workItems.workItems.map((workItem: IWorkItemId) => workItem.id);
    }
    return [];
  }

  async getMyProjects(): Promise<IProject[]> {
    const baseUrl = this.getBaseUrl(AzureRequestLevel.organization);
    const url = `${baseUrl}/_apis/projects?api-version=7.0`;

    return (await this.httpClientService.get<any>(url)).value;
  }

  async getAreas(): Promise<IArea[]> {
    const baseUrl = this.getBaseUrl(AzureRequestLevel.organization);
    const url = `${baseUrl}/_apis/Contribution/dataProviders/query?api-version=5.1-preview.1`;
    const data = {
      contributionIds: ["ms.vss-work-web.agile-admin-areas-data-provider"],
      context: {
        properties: {
          sourcePage: {
            routeValues: {
              project: globalState.projectName,
            },
          },
        },
      },
    };
    const response = await this.httpClientService.post<any>(url, data);

    return response["data"]["ms.vss-work-web.agile-admin-areas-data-provider"][
      "areas"
    ].map((area: any) => ({
      areaId: area.id,
      name: area.text,
      children: area.children.map((child: any) => ({
        subAreaId: child.id,
        name: child.text,
      })),
    }));
  }

  async getMyTeams(): Promise<ITeam[]> {
    const baseUrl = this.getBaseUrl(AzureRequestLevel.organization);
    const url = `${baseUrl}/_apis/teams?api-version=7.1-preview.3`;

    return (await this.httpClientService.get<any>(url)).value;
  }

  async validCredentials() {
    try {
      await this.getMyProjects();
    } catch (error) {
      return false;
    }
    return true;
  }

  getBaseUrl(level: AzureRequestLevel) {
    const azureRequest: { [key: string]: string } = {};

    azureRequest["baseUrl"] = globalState.baseUrl;

    switch (level) {
      case AzureRequestLevel.baseUrl:
        return Object.values(azureRequest).join("/");

      case AzureRequestLevel.organization:
        azureRequest["organization"] = globalState.organizationName;
        break;

      case AzureRequestLevel.project:
        azureRequest["organization"] = globalState.organizationName;
        azureRequest["project"] = globalState.projectName;
        break;

      case AzureRequestLevel.area:
        azureRequest["organization"] = globalState.organizationName;
        azureRequest["project"] = globalState.projectName;
        azureRequest["area"] = globalState.subAreaId;
        break;

      default:
        break;
    }

    return Object.values(azureRequest).join("/");
  }
}
