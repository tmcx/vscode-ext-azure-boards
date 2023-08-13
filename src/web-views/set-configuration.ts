import {
  WebviewViewResolveContext,
  WebviewViewProvider,
  CancellationToken,
  ExtensionContext,
  WebviewView,
  Webview,
  Uri,
} from "vscode";
import { IWebviewViewProvider } from "../interfaces/extension-configurator";
import { globalState } from "../extension";
import { AzureService } from "../service/azure";
import { TDP } from "../tree-data-providers/my-work-items";
import { StringUtil } from "../utils/string";

const EVENT = {
  SET_CONFIGURATION: "set-configuration",
  SET_DETAILS: "set-details",
};

export class SetConfigurationView implements WebviewViewProvider {
  azureService: AzureService;
  webviewView!: WebviewView;

  constructor(private readonly context: ExtensionContext) {
    this.azureService = new AzureService();
  }

  async resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this.webviewView = webviewView;
    await this.loadView();

    this.webviewView.webview.options = {
      localResourceRoots: [this.context.extensionUri],
      enableScripts: true,
    };

    this.webviewView.webview.onDidReceiveMessage(async (event) => {
      if (event.type === EVENT.SET_CONFIGURATION) {
        globalState.clear();
        const { organizationName, mail, patToken } = event.data;
        globalState.organizationName = organizationName;
        globalState.patToken = patToken;
        globalState.mail = mail;
      }

      if (event.type === EVENT.SET_DETAILS) {
        const { projectName, subAreaId, areaPath } = event.data;
        globalState.projectName = projectName || "";
        globalState.subAreaId = subAreaId || "";
        globalState.areaPath = areaPath || "";
      }
      TDP.refresh();
      await this.loadView();
    });
  }

  public async loadView() {
    this.webviewView.webview.html = await this._getHtmlForWebview(
      this.webviewView.webview
    );
  }

  private async _getHtmlForWebview(webview: Webview) {
    const credentials = await this.azureService.validCredentials();
    const nonce = StringUtil.getNonce();

    return `
      <!DOCTYPE html>
			<html lang="en">
        ${this._getHtmlHead(webview, nonce)}
        <body>
          ${await this._getHtmlForCredentialSection(credentials)}
          ${await this._getHtmlForDetailsSection(credentials)}
          
          ${await this._getHtmlScript(webview, nonce)}
        </body>
			</html>
    `;
  }

  private async _getHtmlForCredentialSection(credentials: boolean) {
    const status = credentials ? "valid" : "invalid";
    return `
      <h3>Credentials</h3>

      <label for="organization">Organization</label>
      <input type="text" id="organization" value="${globalState.organizationName}">


      <label for="mail">Mail</label>
      <input type="mail" id="mail" value="${globalState.mail}">

      <label for="patToken">PAT Token</label>
      <input type="password" id="patToken" value="${globalState.patToken}">

      <div class="action">
        <div class="credentials ${status}">${status}</div>
        <button type="button" id="credentials-set-button" disabled="true" >ACCEPT</button>        
      </div>
    `;
  }

  private async _getHtmlForDetailsSection(credentials: boolean) {
    if (!credentials) {
      return "";
    }
    return `
      <h3>Details</h3>

      ${await this._getHtmlForProjectOptions(credentials)}
      ${await this._getHtmlForAreaOptions(credentials)}     
    `;
  }

  private async _getHtmlForProjectOptions(credentials: boolean) {
    if (!credentials) {
      return "";
    }
    const projects = await this.azureService.getMyProjects();

    const projectOptions = projects
      .map((project) => {
        const selected =
          project.name === globalState.projectName ? "selected" : "";
        return `<option class="project-option" value="${project.name}" ${selected}>${project.name}</option>`;
      })
      .join("");
    const defaultOption = !globalState.projectName
      ? "<option disabled selected>Select project</option>"
      : "";
    return `
      <select id="project-select">
        ${defaultOption}
        ${projectOptions}
      </select>
    `;
  }

  private async _getHtmlForAreaOptions(credentials: boolean) {
    if (!globalState.projectName || !credentials) {
      return "";
    }

    const areas = await this.azureService.getAreas();

    const areaOptions = areas
      .map((area) => {
        return area.children
          .map((subArea) => {
            const selected =
              subArea.subAreaId === globalState.subAreaId ? "selected" : "";
            return `<option class="area-option" value="${subArea.subAreaId}" ${selected}>${area.name}\\${subArea.name}</option>`;
          })
          .join("");
      })
      .join("");

    const defaultOption = `<option class="area-option" value="" ${
      !globalState.areaPath ? "selected" : ""
    }>All</option>`;

    return `
    <label for="area-select">Area</label>
    <select id="area-select">
      ${defaultOption}
      ${areaOptions}
    </select>
    `;
  }

  private _getHtmlHead(webview: Webview, nonce: String) {
    const styleMainUri = webview.asWebviewUri(
      Uri.joinPath(
        this.context.extensionUri,
        "media",
        "set-configuration",
        "main.css"
      )
    );
    return `
    <head>
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
      <link href="${styleMainUri}" rel="stylesheet">
      <title>Cat Colors</title>
    </head>
    `;
  }

  private _getHtmlScript(webview: Webview, nonce: String) {
    const scriptUri = webview.asWebviewUri(
      Uri.joinPath(
        this.context.extensionUri,
        "media",
        "set-configuration",
        "main.js"
      )
    );
    return `<script nonce="${nonce}" src="${scriptUri}"></script>`;
  }
}

export const WEBVIEW_SET_CONFIGURATION: IWebviewViewProvider<SetConfigurationView> =
  {
    wvp: (context: ExtensionContext) => {
      WEBVIEW_SET_CONFIGURATION.instance = new SetConfigurationView(context);
      return WEBVIEW_SET_CONFIGURATION.instance;
    },
    instance: undefined,
    id: "set-configuration",
  };
