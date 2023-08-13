import { ViewColumn, window } from "vscode";
import { CMD_WORK_ITEM_DETAILS } from "../commands/work-items-details";
import { AzureService } from "../service/azure";
import { globalState } from "../extension";
import { IWorkItem } from "../interfaces/azure";

const UNDEFINED = '<span class="undefined">Not defined</span>';

export class WorkItemDetailsView {
  azureService: AzureService;

  constructor() {
    this.azureService = new AzureService();
  }

  public async show(workItem: IWorkItem) {
    const column = window.activeTextEditor
      ? window.activeTextEditor.viewColumn
      : undefined;

    const { "System.Title": title } = workItem.fields;

    const panel = window.createWebviewPanel(
      CMD_WORK_ITEM_DETAILS.id,
      title,
      column || ViewColumn.One
    );
    panel.webview.html = `
      <head>
        ${this.getGlobalStyles()}
      </head>

      <body>
        ${this.getMainInformation(workItem)}
        ${this.getDescription(workItem)}
        ${await this.getComments(workItem)}
      </body>
    `;
  }

  getDescription(workItem: IWorkItem) {
    let { "System.Description": description } = workItem.fields;
    description ??= UNDEFINED;
    return `
      <style>
        .description {
          border: solid 1px #EAEAEA;
          background: #fff;
          padding: 5px;
        }
      </style>

      <h3>Description:</h3>
      <div class="description">
        <p>${description || ""}</p>
      </div>
    `;
  }

  getGlobalStyles() {
    return `
      <style>
        .undefined {
          color: #d1d1d1;
        }

        body {
          background-color: #fafafa;
          background-image: url("https://www.transparenttextures.com/patterns/absurdity.png");
          margin: 50px auto;
          max-width: 900px;
        }

        * {
          box-sizing: content-box;
          margin: 0px;
          color: #000;
        }

        h3 {
          margin-top: 25px;
          background: #081b4bd4;
          color: #fff;
          margin-bottom: 5px;
          padding: 5px;
          border: solid 1px #EAEAEA;
          font-weight: 500;
        }

        .description {
          border: solid 1px #EAEAEA;
          background: #fff;
          padding: 10px;
        }
      </style>    
    `;
  }

  getMainInformation(workItem: IWorkItem) {
    const {
      "Microsoft.VSTS.Scheduling.OriginalEstimate": estimation,
      "Microsoft.VSTS.Common.Priority": priority,
      "Microsoft.VSTS.Scheduling.Effort": effort,
      "System.IterationPath": iterationPath,
      "System.WorkItemType": workItemType,
      "System.TeamProject": teamProject,
      "System.AssignedTo": assignedTo,
      "System.AreaPath": areaPath,
      "System.Reason": reason,
      "System.Tags": tagsRaw,
      "System.State": state,
      "System.Title": title,
    } = workItem.fields;

    const tags = tagsRaw?.split("; ").join(", ") || "";
    const { displayName: assignedToName } = assignedTo;

    const url = `https://dev.azure.com/${globalState.organizationName}/${teamProject}/_workitems/edit/${workItem.id}`;
    let properties: { [label: string]: string | number } = {
      ...(!!state && { State: state }),
      ...(!!estimation && { Estimation: estimation }),
      ...(!!priority && { Priority: priority }),
      ...{ Effort: effort ?? UNDEFINED },
      ...(!!reason && { Reason: reason }),
      ...(!!areaPath && { Area: areaPath }),
      ...(!!iterationPath && { Iteration: iterationPath }),
    };
    const values = Object.entries(properties)
      .map(([key, value]) => `<p><b>${key}:</b> ${value}</p>`)
      .join("");
    return `
      <style>
        .type-and-id {
          text-decoration: none;
          text-transform: uppercase;
          font-size: 12px;
          background: #081b4b;
          padding: 5px;
          border: solid 2px #081b4b;
          border-bottom: none;
        }

        .type-and-id > a{
          color: #ededed;
        }

        .title {
          font-size: 18px;
          padding: 5px;
          background: #fff;
          border: solid 2px #081b4b;
          color: #081b4b;
          font-weight: 500;
        }

        .title > span {
          text-shadow: 0px 0px 1px black,
            0px 0px 1px black,
            0px 0px 1px black;
          color: #fff;
        }

        .state-information {
          display: flex;
          flex-direction: column;
          background-color: #f8f8f8;
          padding: 5px;
          border: solid 1px #EAEAEA;
        }

        .main-information {
          display: flex;
          flex-direction: row;
          box-sizing: box-content;
        }

        .main-information > p {
          border: solid 1px #EAEAEA;
          background-color: #f8f8f8;
          padding: 5px;
          margin: 5px 10px 5px 0px;
        }
      </style>

        
      <p class="type-and-id"><a href="${url}">${workItemType} ${workItem.id}</a></p>   
        <p class="title"><span>#${workItem.id}</span> ${title}</p>
  
        <div class="main-information">
          <p><b>Assigned To:</b> ${assignedToName}</p>
          <p><b>Tags:</b> ${tags}</p>
        </div>
        
        <div class="state-information">
          ${values}
        </div>
    `;
  }

  async getComments(workItem: IWorkItem) {
    const { "System.CommentCount": commentCount } = workItem.fields;
    if (!commentCount) {
      return "";
    }
    const comments =
      (await this.azureService.getComments(workItem.id)).comments || [];

    return `
      <style>
      .comment {
        border: solid 1px #EAEAEA;
        margin-bottom: 10px;
        padding: 10px;
        background: #fff;
      }

      .comment > .user {
        margin-bottom: 10px;
        color: #9d9d9d;
      }

      .comment > .user > b {
        font-weight: 500;
      }
      </style>

      <div class="comments">
        <h3>[${commentCount}] Comments</h3>
        ${comments
          .map(
            (comment) =>
              `<div class="comment">
            <p class="user"><b>${comment.modifiedBy.displayName}</b> ${new Date(
                comment.modifiedDate
              ).toLocaleString()}</p>
            <p class="content"> ${comment.text}</p>
          </div>`
          )
          .join("")}
      </div>
    `;
  }
}
