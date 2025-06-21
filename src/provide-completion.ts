import * as vscode from 'vscode';

export class ProvideCompletion {

    private static _instance: ProvideCompletion = new ProvideCompletion();
    public static get instance() {
        return this._instance;
    }

    private _default_items: vscode.CompletionItem[] = [];
    private _module_items = new Map<string, vscode.CompletionItem[]>();

    private _data = {
        keywords: [
            "var", "set", "const", "extends", "function",
            "object", "enum", "as", "import", "echo",
            "and", "or", "print"
        ],
        keywords_control: [
            "if", "else", "while", "do", "loop", "for",
            "in", "return", "try", "catch", "finally",
            "break", "continue", "new", "as", "import"
        ],
        module: {
            type: {
                get_type_string: "(target: any): string",
                to_string: "(target: any): string",
                to_number: "(target: string): number",
                is_null: "(target: any): bool",
                is_number: "(target: any): bool",
                is_bool: "(target: any): bool",
                is_string: "(target: any): bool",
                is_array: "(target: any): bool",
                is_function: "(target: any): bool",
                is_object: "(target: any): bool"
            },
            strings: {
                len: "(target: string): number",
                substr: "(target: string, start: number, count: number): string",
                at: "(target: string, index: number): string",
                split: "(target: string, separator: string): array"
            },
            arrays: {
                len: "(target: array): number",
                create: "(size: number, value: any): array",
                append: "(target: array, value: any): array",
                insert: "(target: array, index: number, value: any): array",
                remove_from: "(target: array, index: number, count: number): array",
                remove_at: "(target: array, index: number): array",
                remove: "(target: array, value: any): array"
            },
            time: {
                get_tick: "(): number",
                get_utc_time: "(): object",
                get_local_time: "(): object"
            },
            console: {
                input: "(): string",
                log: "(message: any)"
            },
            file: {
                load_text: "(filename: string): string"
            },
            math: {
                sqrt: "(value: number): number",
                min: "(a: number, b: number): number",
                max: "(a: number, b: number): number",
                clamp: "(value: number, min: number, max: number): number",
                trunc: "(value: number): number",
                floor: "(value: number): number",
                ceil: "(value: number): number",
                round: "(value: number): number",
                abs: "(value: number): number"
            },
            random: {
                rand_int: "(): number",
                range_int: "(min_include: number, max_exclude: number): number"
            },
            algorithm: {
                merge_sort: "(target: array, comp: function)"
            },
            peak: {
                exp: "(text: string): number | string",
                execute: "(src: string)"
            }
        }
    };

    public constructor() {
        for (const item of this._data.keywords) {
            this._default_items.push(new vscode.CompletionItem(item, vscode.CompletionItemKind.Keyword));
        }
        for (const item of this._data.keywords_control) {
            this._default_items.push(new vscode.CompletionItem(item, vscode.CompletionItemKind.Keyword));
        }
        Object.entries(this._data.module).forEach(mod => {
            this._default_items.push(new vscode.CompletionItem(mod[0], vscode.CompletionItemKind.Module));
            let items: vscode.CompletionItem[] = [];
            Object.entries(mod[1]).forEach(f => {
                let target = new vscode.CompletionItem(f[0], vscode.CompletionItemKind.Function);
                target.detail = f[1];
                items.push(target);
            });
            this._module_items.set(mod[0], items);
        });
    }

    public OnProvideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        for (const item of this._module_items) {
            if (linePrefix.endsWith(item[0] + ".")) {
                return item[1];
            }
        }
        return this._default_items;
    }

    public static register() {
        return vscode.languages.registerCompletionItemProvider(
            { scheme: 'file', language: 'peakscript' },
            {
                provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                    return ProvideCompletion.instance.OnProvideCompletionItems(document, position);
                },
            }, '.',
        );
    }
}
