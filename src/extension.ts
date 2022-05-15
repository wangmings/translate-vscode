const engineType = require("./translate");
const { camelCase,capitalCase,constantCase,dotCase,headerCase,noCase,paramCase,
pascalCase,pathCase,snakeCase } = require("change-case")

import { window, ExtensionContext, commands, QuickPickItem, QuickPickOptions, workspace } from "vscode";

    
// 激活入口
export function activate(context: ExtensionContext) {
    const disposable = commands.registerCommand("extension.chinese-change-var", main);
    context.subscriptions.push(disposable);
}
export function deactivate() { }





function getList(word:string){
    let var_case = [
        ["驼峰(小)",camelCase],
        ["驼峰(大)",pascalCase],
        ["分词(小)",noCase],
        ["分词(大)",capitalCase],
        ["中线(小)",paramCase],
        ["中线(大)",headerCase],
        ["下划(线)",snakeCase],
        ["对象(小)",dotCase],
        ["路径(小)",pathCase],
        ["常量(大)",constantCase]
    
    ];
    
    
    let var_case_list:any = [];
    var_case.forEach(function(arr:any){
        arr = { label: arr[0] + '  ---->  ', description: arr[1](word)}
        var_case_list.push(arr)
    })

    return var_case_list;

}


// 显示列表
async function vscodeSelect(engine:string, word: string): Promise<string | undefined> {
    const engineTypes:any = { bing:'必应',baidu:'百度',google:'谷歌'};
    let engineName =`变量命名: 选项    翻译源: ${engineTypes[engine]}`;
    const items: QuickPickItem[] = getList(word);
    const opts: QuickPickOptions = { matchOnDescription: true, placeHolder: engineName };
    const selections = await window.showQuickPick(items, opts);
    if (!selections) return;
    return selections.description;
}






// 判断字符串中是否包含中文
function hasChinese(str:string) {
    return /[\u4E00-\u9FA5]+/g.test(str)
}








async function main() {


    // 获取编辑器
    const editor = window.activeTextEditor;
    if (!editor) return;


    // 获取选中文字
    const { selections } = editor;
    for (const selection of selections) {
        const selected = editor.document.getText(selection);
        
        if(selected.length == 0){
            window.showErrorMessage('没有选中字符串!');
            break;
        }

        // 判断字符串是否包含中文
        if(hasChinese(selected) == false){
            window.showErrorMessage('选中的字符串中不包含中文!');
            break;
        }

        // 获取设置的翻译引擎
        const engine = workspace.getConfiguration("translateV3").translationEngine;
                
		// 获取翻译结果
        let word = await engineType[engine](selected);
        

        // 组装选项
        const userSelected = await vscodeSelect(engine, word);

        // 用户选中
        if (!userSelected) return;
        
        // 替换文案
        editor.edit((builder) => builder.replace(selection, userSelected));
    }
}
