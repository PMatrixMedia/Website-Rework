/****************************************************************************************
  Module:		background
  Description:	- Background script required for communicating with local WSA plugin.
				- Only one background script per extension (1 script for all the open tabs).
				- Socket communication (XMLHttpRequest) is only permitted from within the background script.
/****************************************************************************************
  Property of:	Webroot Inc.
  Copyright:    Webroot Inc. (c) 2025
/****************************************************************************************
  Creator:		melsaie@webroot.com
  Manager:		pblaimschein@webroot.com
  Created:		02/10/2017 (mm/dd/yyyy)
*****************************************************************************************/

// ----------------- //
// BACKGROUND object //
// ----------------- //
var Webroot_Background = {

	STANDALONE: 0,
	KEYCODE: '',
	STATUSID: 0,
	INITIALIZED: 0,         // indicating contact to backgroundtask / webassembly
	INSTALLDATE: 0,
	OPTIONSPAGESTARTEDONCE: 0,
	PrivacyAccepted: null,

	Enabled: 0,
	Flg: 0,
	agentPwd: 0, 			// Init PasswordCheck flag

	CtrTimer: null,

	init: function()
	{
		Webroot_Background.initStorage();

		Webroot_Background.removeLegacyStorageItems();
	},

	initStorage: function ()
	{
		chrome.storage.local.get(['PrivacyAccepted', 'IPMs', 'MIDs', 'InstallDate', 'ConfigRules', 'Settings', 'Auth', 'whList', 'rtapcounter', 'latencycounter', 'rulesLastAttempt', 'WSACheckAttempt', 'KC', 'Mode', 'OptionsTabs'], function (result) {

			var storage = {
				ENV: {
					OSID: Webroot_Browser.identify_os(),
					OSName: Webroot_Browser.identifiy_osName(),
					BrowserFlags: Webroot_Browser.browserFlags(),
					InstallDate: 0,
					ConfigRulesDate: "",
					LogLevel: WTSLog.logLevel
				},
				IPMs: "",
				MIDs: "",
				Settings: {}
			};

			if (result.Mode != null) {
				storage["Mode"] = result.Mode;
				if (result.Mode > 1) Webroot_Background.STANDALONE = 1;
			}
			else Webroot_Background.STANDALONE = 1;

			if (result.PrivacyAccepted != null) {
				Webroot_Background.PrivacyAccepted = result.PrivacyAccepted;
			}

			if (result.IPMs != null) {
				if (result.Mode > 1) {
					storage["IPMs"] = result.IPMs;
				}
				else chrome.storage.local.remove('IPMs');
			}

			var instDate;
			if ((typeof result.InstallDate != 'number') || (result.InstallDate > Date.now() / 1000) || (result.InstallDate*1000 < new Date("2010-01-01").getTime())) {
				instDate = Math.floor(Date.now() / 1000);
				chrome.storage.local.set({ "InstallDate": instDate }, function () { });
			}
			else instDate = result.InstallDate;
			storage["ENV"]["InstallDate"] = instDate;
			Webroot_Background.INSTALLDATE = instDate * 1000;

			if (result.MIDs != null) {
				storage["MIDs"] = result.MIDs;
			}

			if (result.ConfigRules != null) {
				const RULESCONFIG_VERSION = 3;   //Keep in sync with RULESCONFIG_VERSION in webassembly.h
				if (result.ConfigRules["VERSION"] == RULESCONFIG_VERSION) {
					storage["ENV"]["ConfigRulesDate"] = result.ConfigRules["DATE"];
				}
			}

			if (result.Settings != null) {
				storage["Settings"] = result.Settings;
			}

			if (result.Auth != null) {
				storage["Auth"] = result.Auth;
			}

			if (result.whList != null) {
				storage["whList"] = result.whList;
			}

			if (result.rtapcounter != null) {
				storage["rtapcounter"] = result.rtapcounter;
			}

			if (result.latencycounter != null) {
				storage["latencycounter"] = result.latencycounter;
			}

			if (result.rulesLastAttempt != null) {
				storage["rulesLastAttempt"] = result.rulesLastAttempt;
			}

			if (result.WSACheckAttempt != null) {
				storage["WSACheckAttempt"] = result.WSACheckAttempt;
			}

			if (result.KC != null) {
				storage["KC"] = result.KC;
			}

			// Initialize with storage data
			Module.Init(JSON.stringify(storage));

			Webroot_Background.INITIALIZED = 1;

			// Init IP cache
			Webroot_IP_cache.init(Webroot_Background.STANDALONE != 0);

			// Init URL cache
			Webroot_urlCache.enable(Webroot_Background.STANDALONE != 0);

			// Send a GetConfig message 
			Webroot_Background.sendInitialConfigMessage();

			BA.checkExpiry(result.Auth, result.Mode);

		});
	},

	removeLegacyStorageItems: function()
	{
		// Remove legacy storage items
		chrome.storage.local.remove('wts_kc');
		chrome.storage.local.remove('wts_connected');
		chrome.storage.local.remove('wts_statusid');
		chrome.storage.local.remove('wts_expires');
		chrome.storage.local.remove('OptionsTabs');
	},

	// --------------------------------------- //
	// Handle incoming messages from NativeApp //
	// --------------------------------------- //
	onNONJSresponse: function (message)
	{


		if (!message)
		{
			console.warn("WTS: onNONJSresponse: empty message");
			return;
		}

		var obj;
		try
		{
			obj = JSON.parse(message);
		}
		catch (err)
		{
			console.warn("WTS: onNONJSresponse: parse error -> " + message);
			return;
		}

		WTSLog.logJSONResponse(obj);

		var tabId = obj.TABID;

		if (!obj.PAYLOAD)
		{
			console.warn("WTS: onNONJSresponse: Invalid JSON object");
			return;
		}

		if (Webroot_Browser.identify_browser() == Webroot_Browser.FIREFOX) {
			if (Webroot_Background.PrivacyAccepted != 1) obj.PAYLOAD.ERR = 55; // ERR=55 -> "Privacy not accepted" (FF)
		}

		// Check for errors
		if (obj.PAYLOAD.ERR != 0)
		{
			// Update background settings
			Webroot_Server.analyseErrorResponse(obj);
			if (Webroot_Server.STANDALONE && Webroot_Server.STATUSID == 53) BA.ExpireCheckTime = 0;
			return;
		}

		// Analyse response
		Webroot_Server.analyseSuccessResponse(obj);
		return;
	},

	// --------------------------------------------------------- //
	// Sends a CONFIG message on browser startup to extract all  //
	// config values.                                            //
	// tab.id == 0 (reserved for background script)            //
	// --------------------------------------------------------- //
	sendInitialConfigMessage: function ()
	{
		// Check for open port
		var returnObj = ComPorts.checkPort(0);
		if (returnObj.error != 0) return true;

		// Grab Port
		var port = returnObj.port;

		// Construct GetConfig request
		var configRequestMsg = Webroot_Server.createConfigRequest(0);

		// Send request to NativeApp
		var iError = ComPorts.sendNonJSModuleMessage(configRequestMsg, port);
	},

	whiteList: function (request, sender, sendResponse) {
		// Check for open port
		returnObj = ComPorts.checkPort(sender.tab.id);
		if (returnObj.error != 0) { sendResponse({ responseText: returnObj }); return true; }
		var port = returnObj.port;

		// Construct WHITELIST request
		var RequestMsg = "";
		if (request.ppURL)
			RequestMsg = Webroot_Server.createWhiteListRequest_QueryV1(request.ppURL, sender.tab.id);
		else if (request.q)
			RequestMsg = Webroot_Server.createWhiteListRequest_QueryV2(request.q, request.hash, sender.tab.id);
		else {
			console.log("unsupported whitelist format");
			return false;
		}


		// Send request to NativeApp
		var iError = ComPorts.sendNonJSModuleMessage(RequestMsg, port);
		if (iError != 0) {
			var obj = Webroot_Server.createJsonErrorResponse(iError, 3);
			sendResponse({ responseText: obj });
			return false;
		}
		sendResponse({ responseText: 0 });

		return false;
	},

	displayOptionsPage: function () {

		chrome.runtime.openOptionsPage(function (x) {
			Webroot_Background.OPTIONSPAGESTARTEDONCE = 1;
		});
	},

	waitUnsuspend: function() {
		return new Promise((resolve, reject) => {
			var tStart = Date.now();

			if (Webroot_Background.INITIALIZED) {
				resolve(true);
				return;
			}
			return check();

			function check() {
				setTimeout(() => {
					if (Webroot_Background.INITIALIZED) {
						resolve(true);
						return;
					}
					if ((Date.now() - tStart) / 1000 > 5 /* seconds */) {
						resolve(false);
						return;
					}
					check();
				}, 50);
			};

		});
	}
};

// ------------------------------- //
//	 Msg listener to communicate   //
//   with the content Scripts  	   //
// ------------------------------- //
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	var returnObj = 0;

	// check if initialized
	if (!Webroot_Background.INITIALIZED) {
		Webroot_Background.waitUnsuspend().then((success) => {
			if (success) onIncomingMessage(request, sender, sendResponse);
			else sendResponse({ responseText: 10504 });
		});
		return true;
	}

	return onIncomingMessage(request, sender, sendResponse);
});

function onIncomingMessage(request, sender, sendResponse) {

	if (sender.tab && sender.tab.id == -1) { //Edge debugger
		sendResponse({ responseText: 0, INITIALIZED: Webroot_Background.INITIALIZED, STANDALONE: Webroot_Background.STANDALONE });
		return false;
	}

	// ------ //
	// CONFIG //
	// ------ //
	if (request.msg == "CONFIG") {
		// Check for open port
		returnObj = ComPorts.checkPort(sender.tab.id);
		if (returnObj.error != 0) { sendResponse({ responseText: returnObj, INITIALIZED: Webroot_Background.INITIALIZED, STANDALONE: Webroot_Background.STANDALONE }); return false; }
		var port = returnObj.port;

		// Construct GetConfig request
		var configRequestMsg = Webroot_Server.createConfigRequest(sender.tab.id, request.skipresponse, request.integratedCheck);

		// Send request to NativeApp
		var iError = ComPorts.sendNonJSModuleMessage(configRequestMsg, port);
		if (iError != 0)
		{
			var obj = Webroot_Server.createJsonErrorResponse(iError, 4);
			sendResponse({ responseText: obj, INITIALIZED: Webroot_Background.INITIALIZED, STANDALONE: Webroot_Background.STANDALONE });
			return false;
		}

		sendResponse({ responseText: 0, INITIALIZED: Webroot_Background.INITIALIZED, STANDALONE: Webroot_Background.STANDALONE });
		return false;
	}

	// ----------------- //
	//  Latency Counters //
	// ----------------- //
	else if (request.msg == "PAGE-SYNC-LATENCY" || request.msg == "PAGE-ASYNC-LATENCY" || request.msg == "PAGE-UNSUSPEND-LATENCY") {
		if (request.value !== undefined || request.value !== null) {

			//Report latency counters to webassembly
			Module.UpdateLatencyCounter(request.msg, request.value);
		}

		return true;
	}

	// ----- //
	//  BCAP //
	// ----- //
	else if (request.msg == "BCAP") {
		// Check for open port
		if (!sender.tab) {
			//Edge debugger triggered download
			sendResponse({ responseText: 0 })
			return false;
		}

		returnObj = ComPorts.checkPort(sender.tab.id);
		if (returnObj.error != 0) { sendResponse({ responseText: returnObj }); return false; }
		var port = returnObj.port;

		// Construct BCAP request
		Webroot_Server.createBcapRequest(request.ppURL, sender.tab.id, request.ref).then((bcapRequestMsg) => {

			// Send request to NativeApp
			var iError = ComPorts.sendNonJSModuleMessage(bcapRequestMsg, port);
			if (iError != 0) {
				var obj = Webroot_Server.createJsonErrorResponse(iError, 1);
				sendResponse({ responseText: obj });
				return false;
			}

			sendResponse({ responseText: 0 });
			return false;
		});
		return true;
	}

	// --- //
	// SRA //
	// --- //
	else if (request.msg == "SRA") {
		// Check for open port
		returnObj = ComPorts.checkPort(sender.tab.id);
		if (returnObj.error != 0) { sendResponse({ responseText: returnObj }); return false; }
		var port = returnObj.port;

		// Create SRA Request
		Webroot_Server.createSraRequest(request.links, sender.tab.id).then(RequestMsg => {

			// Send request to NativeApp
			var iError = ComPorts.sendNonJSModuleMessage(RequestMsg, port);
			if (iError != 0) {
				var obj = Webroot_Server.createJsonErrorResponse(iError, 1);
				sendResponse({ responseText: obj });
				return false;
			}

			sendResponse({ responseText: 0 });
		});
		return true;
	}

	// ---- //
	// RTAP //
	// ---- //
	else if (request.msg == "RTAP") {
		// Check for open port
		returnObj = ComPorts.checkPort(sender.tab.id);
		if (returnObj.error != 0) { sendResponse({ responseText: returnObj }); return false; }
		var port = returnObj.port;

		// Create Request
		Webroot_Server.createRtapRequest(request.isDynRTAP, request.RootHTML, request.ppURL, sender.tab.id, request.ref).then((RequestMsg) => {

			// Send request to NativeApp
			var iError = ComPorts.sendNonJSModuleMessage(RequestMsg, port);
			if (iError != 0) {
				var obj = Webroot_Server.createJsonErrorResponse(iError, 2);
				sendResponse({ responseText: obj });
				return false;
			}

			sendResponse({ responseText: 0 });
			return false;
		});
		return true;
	}

	// --------- //
	// WHITELIST //
	// --------- //
	else if (request.msg == "WHITELIST") {
		return Webroot_Background.whiteList(request, sender, sendResponse);
	}

	// ------------------------- //
	// Change BrowserAction Icon //
	// ------------------------- //
	else if (request.msg == "update_browseraction_icon") {
		// Update BrowserAction icon

		if (sender.tab) BA.updateBrowserAction(request.data, sender.tab.id);
		else BA.updateBrowserAction(request.data, undefined);

		sendResponse({ responseText: 0 });

		// Support ASYNC Communication
		return false;
	}

	// ----------------------------- //
	// Open Webroot online kart page //
	// ----------------------------- //
	else if (request.msg == "open_purchase_page") {
		// open options page
		chrome.tabs.create({ url: "https://www.webroot.com/us/en/home/products/complete" });

		sendResponse({ responseText: 0 });
		// Support ASYNC Communication
		return false;
	}

	// -------------------------------------- //
	// Open Webroot <Can't find Keycode> page //
	// -------------------------------------- //
	else if (request.msg == "open_forgot_page") {
		// open options page
		chrome.tabs.create({ url: "https://answers.webroot.com/Webroot/ukp.aspx?pid=12&login=1&app=vw&solutionid=1547&donelr=1" });
		sendResponse({ responseText: 0 });

		// Support ASYNC Communication
		return false;
	}

	// ------------------------- //
	// Open page specified //
	// ------------------------- //
	else if (request.msg == "open_page") {

		var Url = request.url;
		if (!Url) return true;

		// open options page
		chrome.tabs.create({ url: Url });

		sendResponse({ responseText: 0 });

		// Support ASYNC Communication
		return false;
	}

	// -------------------------------- //
	// Validate Keycode with Sky Server //
	// -------------------------------- //
	else if (request.msg == "VALIDATE") {

		// in case options page shows keycode dialog after switching to integrated -> reload options page
		if (!Webroot_Background.STANDALONE) {
			chrome.runtime.sendMessage({ msg: "BKINITIALIZED" }, {}, function (response) { var err = chrome.runtime.lastError });
			return false;
		}

		// Check for open port
		returnObj = ComPorts.checkPort(0);
		if (returnObj.error != 0) { chrome.runtime.sendMessage({ msg: "VALIDATE", response: returnObj }); return false; }
		var port = returnObj.port;

		// Construct VALIDATE request
		var RequestMsg = Webroot_Server.createValidateRequest(request.data);

		// Send request to NativeApp
		var iError = ComPorts.sendNonJSModuleMessage(RequestMsg, port);
		if (iError != 0) {
			var obj = Webroot_Server.createJsonErrorResponse(iError, 7);
			chrome.runtime.sendMessage({ msg: "VALIDATE", response: obj });
		}

		return false;
	}

	// -------------------------------- //
	// Trigger IPM notification         //
	// -------------------------------- //
	else if (request.msg == "IPM") {

		// Check for open port
		returnObj = ComPorts.checkPort(0);
		if (returnObj.error != 0) { chrome.runtime.sendMessage({ msg: "VALIDATE", response: returnObj }); return false; }
		var port = returnObj.port;

		var RequestMsg = {
			TABID: 0,
			PAYLOAD: {
				VER: 1,
				OP: 10,
				BRWSR: Webroot_Browser.identify_browser(),
				DATA: []
			}
		};

		// Send request to NativeApp
		var iError = ComPorts.sendNonJSModuleMessage(JSON.stringify(RequestMsg), port);
		if (iError != 0) {
			var obj = Webroot_Server.createJsonErrorResponse(iError, 10);
			chrome.runtime.sendMessage({ msg: "IPM", response: obj });
		}

		return false;
	}

	// ------------------------------------------------ //
	// CHeck if extension is running in standalone mode //
	// ------------------------------------------------ //
	else if (request.msg == "is_standalone_mode") {
		sendResponse({ responseText: Webroot_Background.STANDALONE, INITIALIZED: Webroot_Background.INITIALIZED, STATUS: Webroot_Background.STATUSID, NONTABBEDERROR: BA.fNonTabbedErrorReported });

		// Support ASYNC Communication
		return false;
	}

	// ----------------------------- //
	// Return URL within given tabId //
	// ----------------------------- //
	else if (request.msg == "getTabUrl") {
		chrome.tabs.get(parseInt(request.tabId), function (tab) {
			if (chrome.runtime.lastError) {
				console.log("WTS: ", chrome.runtime.lastError.message);
			}
			else sendResponse({ responseText: tab.url });
		});
		return true;
	}

	// --------------------------------------- //
	// Displays options dialog                 //
	// --------------------------------------- //
	else if (request.msg == "displayOptionsDlg") {

		Webroot_Background.displayOptionsPage();

		sendResponse({ responseText: 0 });
		return false;
	}

	// --------------------------------------- //
	// Wake up suspended worker service        //
	// --------------------------------------- //
	else if (request.msg == "SuspendWakeup") {
		if (Webroot_Background.INITIALIZED) sendResponse({ responseText: 0 });
		else sendResponse({ responseText: 10504 });

		return false;
	}

	else if (request.msg == "LOG") {

		WTSLog.log("TAB:" + sender.tab.id + " " + request.headline, request.details);
		sendResponse({ responseText: 0 });
	}

	return false;
}

// ------------------------------- //
//	 Msg listener to communicate   //
//   with other Webroot extensions //
//   (check installed)             //
// ------------------------------- //
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {

	// ----------------------------- //
	// Returns current extension's version
	// ----------------------------- //
	if (Webroot_Browser.SAFARI != Webroot_Browser.identify_browser()) {

		if (request.msg == "getVersion") {
			chrome.management.getSelf(function (extensionInfo) {
				sendResponse({ version: extensionInfo.version });
			});
			return true;
		}

		if (request.msg == "WHITELIST") {
			return Webroot_Background.whiteList(request, sender, sendResponse);
		}
	}
	return false;
});

// --------------------------- //
// Triggers when tab is closed //
// --------------------------- //
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo)
{
	// Diconnect from NativeApp
	ComPorts.disconnectNonJSModule(tabId);

	// Support ASYNC 
	return true;
});

// ----------------------------- //
// Triggers when settings change //
// ----------------------------- //
chrome.storage.onChanged.addListener(function (changes, namespace) {
	if (namespace != "local") return;

	if (changes["Settings"]) {
		var standalone = (changes["Settings"].newValue.Mode != 1 ? 1 : 0);
		if (Webroot_Background.STANDALONE != standalone) {
			Webroot_Background.STANDALONE = standalone;
			Webroot_urlCache.enable(Webroot_Background.STANDALONE != 0);
			if (!standalone) {
				BA.KCExpDate = null;
				BA.expiring = false;
				Webroot_Background.KEYCODE = '';
			}
		}
		var Flg = (changes["Settings"].newValue.Flg);
		if (Webroot_Background.Flg != Flg) Webroot_Background.Flg = Flg;
		var agentPwd = (changes["Settings"].newValue.AgentPwd);
		if (Webroot_Background.agentPwd != agentPwd) Webroot_Background.agentPwd = agentPwd;

		WTSLog.log("Settings update:\nold: " + JSON.stringify(changes["Settings"].oldValue) + "\nnew: " + JSON.stringify(changes["Settings"].newValue));
	}
	if (changes.Auth || changes.Mode) {
		BA.checkExpiry(!changes.Auth ? undefined : changes.Auth.newValue, !changes.Mode ? undefined : changes.Mode.newValue);
	}

	if (Webroot_Browser.identify_browser() == Webroot_Browser.FIREFOX) {
		if (changes["PrivacyAccepted"]) {
			Webroot_Background.PrivacyAccepted = changes["PrivacyAccepted"].newValue;
		}
	}
});

if (Webroot_Browser.SAFARI == Webroot_Browser.identify_browser()) {

	// Set up a connection to receive messages from the native app. (SWIFT)
	var port = browser.runtime.connectNative("");

	port.onMessage.addListener(function (message) {

		if (message.name == "updateSettings") {
			var settings = JSON.stringify(message.userInfo);
			Module.onMessage(4713, settings);
			return;
		}
	});

	port.onDisconnect.addListener(function (disconnectedPort) {
		WTSLog.trace("Received native port disconnect:");
		WTSLog.trace(disconnectedPort);
	});

	//Listener to content.script
	chrome.runtime.onConnect.addListener(function (port) {

		if (port.name !== 'SuspendWakeup') return;

		port.onMessage.addListener(function (msg) {

			if (port.name !== 'SuspendWakeup') return;

			if (Webroot_Background.INITIALIZED) {
				port.postMessage({ responseText: 0 });
			}
			else {
				port.postMessage({ responseText: 10504 });
			}
		});
		port.onDisconnect.addListener(function () {

		});
	});
}
