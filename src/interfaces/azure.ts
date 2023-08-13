interface Fields {
  "System.AreaPath": string;
  "System.TeamProject": string;
  "System.IterationPath": string;
  "System.WorkItemType": string;
  "System.State": string;
  "System.Reason": string;
  "System.AssignedTo": SystemAssignedTo;
  "System.CreatedDate": string;
  "System.CreatedBy": SystemCreatedBy;
  "System.ChangedDate": string;
  "System.ChangedBy": SystemChangedBy;
  "System.CommentCount": number;
  "System.Title": string;
  "Microsoft.VSTS.Scheduling.OriginalEstimate": number;
  "Microsoft.VSTS.Common.StateChangeDate": string;
  "Microsoft.VSTS.Common.ActivatedDate"?: string;
  "Microsoft.VSTS.Common.ActivatedBy"?: MicrosoftVstsCommonActivatedBy;
  "Microsoft.VSTS.Common.ClosedDate"?: string;
  "Microsoft.VSTS.Common.ClosedBy"?: MicrosoftVstsCommonClosedBy;
  "Microsoft.VSTS.Common.Priority": number;
  "System.Description": string;
  "System.Tags"?: string;
  "Microsoft.VSTS.Scheduling.RemainingWork"?: number;
  "Microsoft.VSTS.Scheduling.CompletedWork"?: number;
  "Microsoft.VSTS.Common.BacklogPriority"?: number;
  "Microsoft.VSTS.Scheduling.DueDate"?: string;
  "Microsoft.VSTS.Scheduling.Effort"?: number;
}

interface AvatarLink {
  avatar: {
    href: string;
  };
}

interface SystemAssignedTo {
  displayName: string;
  url: string;
  _links: AvatarLink;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
}

interface SystemCreatedBy {
  displayName: string;
  url: string;
  _links: AvatarLink;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
}

interface SystemChangedBy {
  displayName: string;
  url: string;
  _links: AvatarLink;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
}

interface MicrosoftVstsCommonActivatedBy {
  displayName: string;
  url: string;
  _links: AvatarLink;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
}

interface MicrosoftVstsCommonClosedBy {
  displayName: string;
  url: string;
  _links: AvatarLink;
  id: string;
  uniqueName: string;
  imageUrl: string;
  descriptor: string;
}

export interface IWorkItem {
  id: number;
  rev: number;
  fields: Fields;
  url: string;
}

export interface IComment {
  mentions: {
    artifactId: string;
    artifactType: string;
    commentId: number;
    targetId: string;
  }[];
  workItemId: number;
  id: number;
  version: number;
  text: string;
  createdBy: {
    displayName: string;
    url: string;
    _links: {
      avatar: {
        href: string;
      };
    };
    id: string;
    uniqueName: string;
    imageUrl: string;
    descriptor: string;
  };
  createdDate: string;
  modifiedBy: {
    displayName: string;
    url: string;
    _links: {
      avatar: {
        href: string;
      };
    };
    id: string;
    uniqueName: string;
    imageUrl: string;
    descriptor: string;
  };
  modifiedDate: string;
  format: string;
  renderedText: string;
  url: string;
}

export interface IProject {
  id: string;
  name: string;
  description: string;
  url: string;
  state: string;
  revision: number;
  visibility: string;
  lastUpdateTime: string;
}

export interface ITeam {
  id: string;
  name: string;
  url: string;
  description: string;
  identityUrl: string;
  projectName: string;
  projectId: string;
}

export enum AzureRequestLevel {
  baseUrl,
  organization,
  project,
  area,
}

export interface IWorkItemId {
  id: number;
  url: string;
}

export interface IArea {
  children: { subAreaId: string; name: string }[];
  areaId: string;
  name: string;
}
