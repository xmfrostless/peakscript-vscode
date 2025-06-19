import * as vscode from 'vscode';

export class ProvideCompletion {

    private static _instance: ProvideCompletion = new ProvideCompletion();
    public static get instance() {
        return this._instance;
    }

    private _keywords = [
        "var", "set", "const", "extends", "function", "object",
        "enum", "as", "import", "echo", "and", "or"
    ];
    private _keywords_control = [
        "if", "else", "while", "do", "loop", "for", "in", "return",
        "try", "catch", "finally", "break", "continue", "new", "as", "import"
    ];

    private _modules = [
        "type",
        "strings",
        "arrays",
        "time",
        "console",
        "file",
        "math",
        "random",
        "algorithm",
    ];

    private _def_completion_items: vscode.CompletionItem[] = [];

    public constructor() {
        for (const item of this._keywords) {
            this._def_completion_items.push(new vscode.CompletionItem(item, vscode.CompletionItemKind.Keyword));
        }
        for (const item of this._keywords_control) {
            this._def_completion_items.push(new vscode.CompletionItem(item, vscode.CompletionItemKind.Keyword));
        }
    }

    public create() {
        const def_completion_items = this._def_completion_items;
        // 注册代码提示提供者
        return vscode.languages.registerCompletionItemProvider(
            { scheme: 'file', language: 'peakscript' }, // 替换为你的语言ID
            {
                provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                    // 获取当前行的文本直到光标位置
                    const linePrefix = document.lineAt(position).text.substring(0, position.character);

                    // 根据输入条件提供提示
                    if (linePrefix.endsWith('if ')) {
                        return [
                            new vscode.CompletionItem('condition', vscode.CompletionItemKind.Keyword),
                            new vscode.CompletionItem('true', vscode.CompletionItemKind.Value),
                            new vscode.CompletionItem('false', vscode.CompletionItemKind.Value)
                        ];
                    }

                    // 添加更多条件判断和提示
                    if (linePrefix.endsWith('func ')) {
                        return [
                            new vscode.CompletionItem('main', vscode.CompletionItemKind.Function),
                            new vscode.CompletionItem('calculate', vscode.CompletionItemKind.Function)
                        ];
                    }

                    return def_completion_items;
                }
            },
            '.',
        );
    }
}
