import * as assert from 'assert';
import * as vscode from 'vscode';
import * as farajExt from '../extension';

suite('Extension Test Suite', () => {

  let originalShowErrorMessage: typeof vscode.window.showErrorMessage;
  let capturedMessage: string | undefined;
  setup(() => {
    originalShowErrorMessage = vscode.window.showErrorMessage;
		console.log("here setup");

    vscode.window.showErrorMessage = ((msg: string) => {
		console.log("called showErrorMessage", msg);
      capturedMessage = msg;
      return Promise.resolve(undefined);
    }) as any;
  });

  teardown(() => {
	console.log("teardown");
    vscode.window.showErrorMessage = originalShowErrorMessage;
    capturedMessage = undefined;
  });



	vscode.window.showInformationMessage('Start all tests.');

	test('If required configuration are not defined show appropiate message',async () => {
		const config = vscode.workspace.getConfiguration('faraj');
		const libreHost = config.get<string>('libretranslateHost');
		const librePort = config.get<string>('libretranslatePort');
    const fakeContext = {
      subscriptions: [],
    } as unknown as vscode.ExtensionContext;

    await farajExt.activate(fakeContext);

		console.log("capturedMessage", capturedMessage);
		assert.ok(true);
		assert.ok(capturedMessage?.includes('Please set the libretranslateHost or/and libretranslatePort in your settings.'));
		//assert.ok(libreHost, 'libretranslateHost should be defined');
		//assert.ok(librePort, 'libretranslatePort should be defined');
	
	});

	/*
	test('Active editor should be null or a TextEditor', () => {
		const editor = vscode.window.activeTextEditor;
		assert.ok(editor === null || typeof editor?.edit === 'function');
	});
*/
	test('Register and execute dummy command', async () => {
		const commandId = 'vscode-faraj.dummyTestCommand';
		const disposable = vscode.commands.registerCommand(commandId, () => 'dummy');
		const result = await vscode.commands.executeCommand(commandId);
		assert.strictEqual(result, 'dummy');
		disposable.dispose();
	});

	test('Show information message returns a thenable', async () => {
		const thenable = vscode.window.showInformationMessage('Test message');
		assert.ok(typeof (thenable as any).then === 'function');
	});
});
test('translateWithLibreTranslate translates text (mocked fetch)', async () => {
	// Arrange
	const originalFetch = globalThis.fetch;
	const mockResponse = {
		ok: true,
		json: async () => ({ translatedText: 'مرحبا' })
	};
	globalThis.fetch = async () => mockResponse as any;

	const text = 'hello';
	const sourceLang = 'en';
	const targetLang = 'ar';

	// Act
	const result = await farajExt.translateWithLibreTranslate(text, sourceLang, targetLang);

	// Assert
	assert.strictEqual(result, 'مرحبا');

	// Cleanup
	globalThis.fetch = originalFetch;
});

test('translateWithLibreTranslate throws on failed response (mocked fetch)', async () => {
	// Arrange
	const originalFetch = globalThis.fetch;
	const mockResponse = {
		ok: false,
		statusText: 'Bad Request'
	};
	globalThis.fetch = async () => mockResponse as any;

	const text = 'hello';
	const sourceLang = 'en';
	const targetLang = 'ar';

	await assert.rejects(
		() => farajExt.translateWithLibreTranslate(text, sourceLang, targetLang),
		/Translation failed: Bad Request/
	);

	// Cleanup
	globalThis.fetch = originalFetch;
});
