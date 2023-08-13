import {
  ExtensionContext,
  TreeDataProvider,
  WebviewViewProvider,
} from "vscode";

interface CustomTreeDataProvider extends TreeDataProvider<unknown> {
  refresh(): void;
}

export type TCallback = (...args: any[]) => any;

export interface ICommand {
  callback: TCallback;
  id: string;
}

export interface ITreeDataProvider {
  tdp: CustomTreeDataProvider;
  id: string;
}

export interface IWebviewViewProvider<T> {
  wvp: (context: ExtensionContext) => WebviewViewProvider;
  instance?: T;
  id: string;
}
