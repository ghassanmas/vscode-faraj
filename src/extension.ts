// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

interface LibreTranslateResponse {
  translatedText: string;
}


const config = vscode.workspace.getConfiguration('faraj');
const Librahost = config.get<string>('libratranslateHost');
const Libraport = config.get<string>('libratranslatePort');
const insertAfter = config.get<boolean>('insertAfter');

async function translateWithLibreTranslate(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {


  const response = await fetch(`http://${Librahost}:${Libraport}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text',
      api_key: '' // optional
    })
  });

  if (!response.ok) {
	console.log("eehy, error")
    throw new Error(`Translation failed: ${response.statusText}`);
  }

  const data = await response.json() as LibreTranslateResponse;

  return data.translatedText;
}



export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-faraj" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// Todo: Refactir with other command
	// Todo: Make langauge to/from configuraable somehow
	const disposable_ar = vscode.commands.registerCommand('vscode-faraj.translate_to_ar', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
	const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const selection: vscode.Selection = editor.selection;
    const selectedText: string = editor.document.getText(selection);
	const arText = await translateWithLibreTranslate(selectedText,'en','ar')

	editor.edit(editBuilder => {
	console.log("insertAfter",insertAfter)
	const finalText = insertAfter ? `${selectedText} \n ${arText}` : arText;
	editBuilder.replace(selection, finalText);
	});


		vscode.window.showInformationMessage(`Translated selected text to Arabic.`);
	});

		const disposable_en = vscode.commands.registerCommand('vscode-faraj.translate_to_en', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
    	if (!editor) return;
		const selection: vscode.Selection = editor.selection;
		const selectedText: string = editor.document.getText(selection);
		const enText = await translateWithLibreTranslate(selectedText,'ar','en')

		const finalText = insertAfter ? `${selectedText} \n ${enText}` : enText;

		editor.edit(editBuilder => {
		editBuilder.replace(selection, finalText);
		});


		vscode.window.showInformationMessage('translated selected to English');
	});


	context.subscriptions.push(disposable_ar);
	context.subscriptions.push(disposable_en);

}

// This method is called when your extension is deactivated
export function deactivate() {}
