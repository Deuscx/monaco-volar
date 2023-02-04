import type { worker } from "monaco-editor";
import { getLanguageServiceAndDocumentsService } from "./services";
import * as vscode from "vscode-languageserver-protocol";

export interface ICreateData {
  languageId: string;
  extraLibs?: Record<string, string>;
}

type LSType = ReturnType<typeof getLanguageServiceAndDocumentsService>["ls"];

type TailArgs<T extends (...args: any[]) => void> = T extends (
  a: any,
  ...args: infer Args
) => void
  ? Args
  : never;

type Args<T extends (...args: any[]) => void> = T extends (
  ...args: infer A
) => void
  ? A
  : never;

export class VueWorker {
  private _languageId: string;
  private _ctx: worker.IWorkerContext;

  private _ls: LSType;
  private _extraLibs: Record<string, string>;
  private _modelDocuments = new WeakMap<
    worker.IMirrorModel,
    vscode.TextDocument
  >();

  constructor(ctx: worker.IWorkerContext, createData: ICreateData) {
    this._ctx = ctx;
    this._languageId = createData.languageId;
    this._extraLibs = createData.extraLibs ?? {};

    const { ls } = getLanguageServiceAndDocumentsService(
      () => this._ctx.getMirrorModels(),
      () => this._extraLibs
    );
    this._ls = ls;
  }

  updateExtraLibs(extraLibs: Record<string, string>) {
    this._extraLibs = extraLibs;
  }

  private runWithDocument<T>(
    uri: string,
    callback: (doc: vscode.TextDocument) => T
  ) {
    const model = this._ctx.getMirrorModels().find((x) => x.uri);
    if (model) {
      const document = this.getModelDocument(model);
      return callback(document);
    }
  }

  async doDSAutoInsert(uri: string, ...args: TailArgs<LSType["doAutoInsert"]>) {
    return this.runWithDocument(uri, async (document) => {
      return await this._ls.doAutoInsert(document.uri, ...args);
    });
  }

  async doLSAutoInsert(...args: Args<LSType["doAutoInsert"]>) {
    return await this._ls.doAutoInsert(...args);
  }

  async getFoldingRanges(
    uri: string,
    ...args: TailArgs<LSType["getFoldingRanges"]>
  ) {
    return this.runWithDocument(uri, async (document) => {
      return await this._ls.getFoldingRanges(document.uri, ...args);
    });
  }

  async getColorPresentations(
    uri: string,
    ...args: TailArgs<LSType["getColorPresentations"]>
  ) {
    return this.runWithDocument(uri, async (document) => {
      return await this._ls.getColorPresentations(document.uri, ...args);
    });
  }

  async getSelectionRanges(
    uri: string,
    ...args: TailArgs<LSType["getSelectionRanges"]>
  ) {
    return this.runWithDocument(uri, async (document) => {
      return await this._ls.getSelectionRanges(document.uri, ...args);
    });
  }

  async findDocumentColors(
    uri: string,
    ...args: TailArgs<LSType["findDocumentColors"]>
  ) {
    return this.runWithDocument(uri, async (document) => {
      return await this._ls.findDocumentColors(document.uri, ...args);
    });
  }

  async findDocumentSymbols(
    uri: string,
    ...args: TailArgs<LSType["findDocumentSymbols"]>
  ) {
    return this.runWithDocument(uri, async (document) => {
      return await this._ls.findDocumentSymbols(document.uri, ...args);
    });
  }

  async findLinkedEditingRanges(
    uri: string,
    ...args: TailArgs<LSType["findLinkedEditingRanges"]>
  ) {
    return this.runWithDocument(uri, async (document) => {
      return await this._ls.findLinkedEditingRanges(document.uri, ...args);
    });
  }

  async format(uri: string, ...args: TailArgs<LSType["format"]>) {
    return this.runWithDocument(uri, async (document) => {
      return await this._ls.format(document.uri, ...args);
    });
  }

  async doCodeActions(...args: Args<LSType["doCodeActions"]>) {
    return await this._ls.doCodeActions(...args);
  }

  async doCodeActionResolve(...args: Args<LSType["doCodeActionResolve"]>) {
    return await this._ls.doCodeActionResolve(...args);
  }

  async doCodeLens(...args: Args<LSType["doCodeLens"]>) {
    return await this._ls.doCodeLens(...args);
  }

  async doCodeLensResolve(...args: Args<LSType["doCodeLensResolve"]>) {
    return await this._ls.doCodeLensResolve(...args);
  }

  async doComplete(...args: Args<LSType["doComplete"]>) {
    return await this._ls.doComplete(...args);
  }

  async doCompletionResolve(...args: Args<LSType["doCompletionResolve"]>) {
    return await this._ls.doCompletionResolve(...args);
  }

  async doHover(...args: Args<LSType["doHover"]>) {
    const result = await this._ls.doHover(...args);
    return result;
  }

  async doRename(...args: Args<LSType["doRename"]>) {
    return await this._ls.doRename(...args);
  }

  async doValidation(...args: Args<LSType["doValidation"]>) {
    return await this._ls.doValidation(...args);
  }

  async findDefinition(...args: Args<LSType["findDefinition"]>) {
    return await this._ls.findDefinition(...args);
  }

  async findDocumentHighlights(
    ...args: Args<LSType["findDocumentHighlights"]>
  ) {
    return await this._ls.findDocumentHighlights(...args);
  }

  async findDocumentLinks(...args: Args<LSType["findDocumentLinks"]>) {
    return await this._ls.findDocumentLinks(...args);
  }

  async findFileReferences(...args: Args<LSType["findFileReferences"]>) {
    return await this._ls.findFileReferences(...args);
  }

  async findImplementations(...args: Args<LSType["findImplementations"]>) {
    return await this._ls.findImplementations(...args);
  }

  async findReferences(...args: Args<LSType["findReferences"]>) {
    return await this._ls.findReferences(...args);
  }

  async findTypeDefinition(...args: Args<LSType["findTypeDefinition"]>) {
    return await this._ls.findTypeDefinition(...args);
  }

  async findWorkspaceSymbols(...args: Args<LSType["findWorkspaceSymbols"]>) {
    return await this._ls.findWorkspaceSymbols(...args);
  }

  async getEditsForFileRename(...args: Args<LSType["getEditsForFileRename"]>) {
    return await this._ls.getEditsForFileRename(...args);
  }

  async getInlayHints(...args: Args<LSType["getInlayHints"]>) {
    return await this._ls.getInlayHints(...args);
  }

  async getSemanticTokens(...args: Args<LSType["getSemanticTokens"]>) {
    return await this._ls.getSemanticTokens(...args);
  }

  async getSignatureHelp(...args: Args<LSType["getSignatureHelp"]>) {
    return await this._ls.getSignatureHelp(...args);
  }

  async prepareRename(...args: Args<LSType["prepareRename"]>) {
    return await this._ls.prepareRename(...args);
  }

  getModelDocument(model: worker.IMirrorModel) {
    let document = this._modelDocuments.get(model);
    if (!document || document.version !== model.version) {
      document = vscode.TextDocument.create(
        model.uri.toString(),
        this._languageId,
        model.version,
        model.getValue()
      );
      this._modelDocuments.set(model, document);
    }
    return document;
  }
}
