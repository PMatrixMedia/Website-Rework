/********************************************************************************
  Module:		helper
  Description:	- Script containing all the helper methods used by the background
				  and the content scripts
/********************************************************************************
  Property of:	Webroot Inc.
  Copyright:    Webroot Inc. (c) 2025
/********************************************************************************
  Creator:		melsaie@webroot.com
  Manager:		pblaimschein@webroot.com
  Created:		02/10/2017 (mm/dd/yyyy)
********************************************************************************/

// ------------- //
// Uri class     //
// ------------- //
class Uri {
	constructor(url) {
		if (!url) {
			this.raw = "";
			this.protocol = "";
			this.authority = "";
			this.host = "";
			this.port = "";
			this.fullpath = "";
			this.path = "";
			this.filename = "";
			this.queryString = "";
			this.anchor = "";
			this.querySeparator = "";
			this.pathAndQuery = "";
			this.urlWithoutQuery = "";
			return;
		}
		var uriParts;
		try {
			uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(url);
		}
		catch (err) {
			this.raw = url;
			this.protocol = "";
			this.authority = "";
			this.host = "";
			this.port = "";
			this.fullpath = "";
			this.path = "";
			this.filename = "";
			this.queryString = "";
			this.anchor = "";
			this.querySeparator = "";
			this.pathAndQuery = "";
			this.urlWithoutQuery = "";
			return;
		}
		for (var i = 0; i < uriParts.length; i++) if (!uriParts[i]) uriParts[i] = "";
		this.raw = uriParts[0];
		this.protocol = uriParts[1];
		this.authority = uriParts[2];
		this.host = uriParts[3];
		this.port = uriParts[4];
		this.fullpath = uriParts[5];
		this.path = uriParts[6];
		this.filename = uriParts[7];
		this.queryString = uriParts[8];
		this.anchor = uriParts[9];
		if (this.queryString) {
			var pos = url.indexOf(this.queryString);
			if (pos >= 0) this.querySeparator = url[pos - 1];
		}
		else this.querySeparator = "";
		this.pathAndQuery = this.fullpath + this.querySeparator + this.queryString
		if (this.anchor) this.pathAndQuery += "#" + this.anchor;
		var uriSplitQuery = new RegExp("^[^?#&]+").exec(url);
		this.urlWithoutQuery = uriSplitQuery[0];
	}
	isHostValid() {
		if (!this.host) return false;
		if (this.host.length == 9 && this.host.toLowerCase() == "localhost") return true;
		if (this.host.indexOf(" ") >= 0) return false;
		//first dot
		if (this.host.indexOf(".") <= 0) return false;
		//first dot
		if (this.host.lastIndexOf(".") == this.host.length - 1) return false;
		if (this.host.indexOf("..") >= 0) return false;
		return true;
	}
	query() {
		if (!this.isHostValid()) return {};
		if (!this.queryString) return {};

		var queryDict = {};
		var queryItems = this.queryString.split('&');
		for (var i = 0; i < queryItems.length; i++) {
			var queryPair = queryItems[i].split('=');
			if (queryPair.length == 2) queryDict[queryPair[0]] = queryPair[1];
			else if (queryPair.length == 1) queryDict[queryPair[0]] = undefined;
			else if (queryPair.length > 2) {
				var firstEqual = queryItems[i].indexOf("=");
				queryDict[queryItems[i].substring(0, firstEqual)] = queryItems[i].substr(firstEqual + 1);
			}
		}
		return queryDict;
	}
}

// ------------- //
// Helper Object //
// ------------- //
var Webroot_Helper = {

	// Define variables
	blockPageHost: 'https://wf.webrootanywhere.com',
	blockPagePath: 'http://wf.webrootanywhere.com/ConsumerBlockpage.aspx'.toLowerCase(),
	blockPagePathHttps: 'https://wf.webrootanywhere.com/ConsumerBlockpage.aspx'.toLowerCase(),
	whitePagePath: 'http://wf.webrootanywhere.com/WebFiltering/WhiteList.html'.toLowerCase(),
	whitePagePathHttps: 'https://wf.webrootanywhere.com/WebFiltering/WhiteList.html'.toLowerCase(),
	errorPagePath: 'http://wf.webrootanywhere.com/ErrorPages/Oops.aspx'.toLowerCase(),
	errorPagePathHttps: 'https://wf.webrootanywhere.com/ErrorPages/Oops.aspx'.toLowerCase(),
	IframeblockPagePath: 'http://wf.webrootanywhere.com/IframeBlockpage.aspx'.toLowerCase(),
	IframeblockPagePathHttps: 'https://wf.webrootanywhere.com/IframeBlockpage.aspx'.toLowerCase(),
	iWhitePagePath: 'http://wf.webrootanywhere.com/WebFiltering/iWhiteList.aspx',
	iWhitePagePathHttps: 'https://wf.webrootanywhere.com/WebFiltering/iWhiteList.aspx',
	sraEncodingType: Object.freeze({ "NoEncoding": "0", "Url": "1" }),

	// ------------------------------------------- //
	// Check if IFRAME URL needs to be WhiteListed //
	// ------------------------------------------- //
	isIWhiteListUrl: function (uri) {

		// Check URL
		if (uri?.urlWithoutQuery == Webroot_Helper.iWhitePagePath) return true;
		if (uri?.urlWithoutQuery == Webroot_Helper.iWhitePagePathHttps) return true;

		return false;
	},

	// ---------------------------------- //
	//		 Create BULK URL JSON array	  //
	//       to be sent to service		  //
	// ---------------------------------- //
	create_URL_Array: function (linksArray, domainIndex) {

		var request = [];
		var uri = null;

		// Iterate through the Links array
		for (var i = 0; i < linksArray.length; i++) {
			if (i < 100) {
				// BreakDown URL
				if (linksArray[i].myElement.localName == "a") {
					// <A> Tag
					uri = new Uri(linksArray[i].myElement.href);
				}
				else {
					// <IFRAME> Tag
					uri = new Uri(linksArray[i].myElement.src);
				}

				var processedURL = uri?.urlWithoutQuery;

				// Extract URL
				if (Webroot_Extension.SRA_CONFIG[domainIndex].urlregex != '') {
					var regex = new RegExp(Webroot_Extension.SRA_CONFIG[domainIndex].urlregex, 'i');
					var matches = processedURL.match(regex);
					if (matches)
						processedURL = matches[2];
				}

				// Decode URL
				if (Webroot_Extension.SRA_CONFIG[domainIndex].encode == Webroot_Helper.sraEncodingType.Url) {
					try {
						processedURL = decodeURIComponent(processedURL);
					} catch (e) { processedURL = processedURL; }
				}

				request.push({
					"URL": processedURL,
					"REF": i + 1
				});

			}
		}

		//WTS-626: add second URL for classification to array if only one search result exists
		if (linksArray.length == 1) {
			request.push({
				"URL": "www.google.com",
				"REF": 2
			});
		}

		return request;
	},

	// ---------------------------------- //
	//		 Create BULK URL JSON array	  //
	//       to be sent to service		  //
	// ---------------------------------- //
	create_Url_Array_FromBing: function (linksArray) {
		var request = [];

		// Iterate through the Links array
		for (var i = 0; i < linksArray.length; i++) {
			if (i < 100) {

				var processedURL = linksArray[i].uri.urlWithoutQuery;

				if (processedURL.endsWith("..")) {
					var pos = processedURL.lastIndexOf("?");
					if (pos < 0) pos = processedURL.lastIndexOf("/");
					else pos = pos - 1;
					if (pos < 0) continue;
					processedURL = processedURL.substring(0, pos + 1);
				}

				request.push({
					"URL": processedURL,
					"REF": i + 1
				});

			}
		}
		if (request.length == 0) return request;

		//WTS-626: add second URL for classification to array if only one search result exists
		if (linksArray.length == 1) {
			request.push({
				"URL": "www.google.com",
				"REF": 2
			});
		}

		return request;

	},


	// ---------------------------- //
	// Get Size of String in Bytes  //
	// ---------------------------- //
	getByteLen: function (normal_val) {
		// Force string type
		normal_val = String(normal_val);

		var byteLen = 0;
		for (var i = 0; i < normal_val.length; i++) {
			var c = normal_val.charCodeAt(i);
			byteLen += c < (1 << 7) ? 1 :
					   c < (1 << 11) ? 2 :
					   c < (1 << 16) ? 3 :
					   c < (1 << 21) ? 4 :
					   c < (1 << 26) ? 5 :
					   c < (1 << 31) ? 6 : Number.NaN;
		}
		return byteLen;
	},

	// ---------------------------------- //
	// Check if URL needs to be by-passed //
	// ---------------------------------- //
	isContentScriptFilteredUrl: function (uri)
	{
		if (!uri || uri?.raw == '') return true;

		var urlWithoutQuery = uri.urlWithoutQuery.toLowerCase();
		var urlPrefix = uri.protocol;

		if (urlWithoutQuery == Webroot_Helper.blockPagePath) return true;
		if (urlWithoutQuery == Webroot_Helper.IframeblockPagePath) return true;
		if (urlWithoutQuery == Webroot_Helper.errorPagePath) return true;

		if (urlWithoutQuery == Webroot_Helper.blockPagePathHttps) return true;
		if (urlWithoutQuery == Webroot_Helper.IframeblockPagePathHttps) return true;
		if (urlWithoutQuery == Webroot_Helper.errorPagePathHttps) return true;

		if (urlWithoutQuery == "about:blank") return true;
		if (urlWithoutQuery == 'about:privatebrowsing') return true;
		if (urlWithoutQuery == 'about:newtab') return true;
		if (urlWithoutQuery == 'about:home') return true;
		if (urlWithoutQuery == 'about:addons') return true;
		if (urlWithoutQuery == 'about:support') return true;
		if (urlWithoutQuery == null) return true;
		if (urlPrefix == "file" || urlPrefix == "data" || urlPrefix == "blob" ||
			urlPrefix == "chrome" || urlPrefix == "chrome-extension" || urlPrefix == "moz-extension" || urlPrefix == "externalfile") return true;

		return false;
	},

	// ------------------------- //
	// Check if URL is BlockPage //
	// ------------------------- //
	isBlockPageUrl: function (uri)
	{
		var urlWithoutQuery = uri.urlWithoutQuery.toLowerCase();

		if (urlWithoutQuery == Webroot_Helper.blockPagePath) return true;
		if (urlWithoutQuery == Webroot_Helper.blockPagePathHttps) return true;

		if (urlWithoutQuery == Webroot_Helper.IframeblockPagePath) return true;
		if (urlWithoutQuery == Webroot_Helper.IframeblockPagePathHttps) return true;

		return false;
	},

	// ------------------------- //
	// Check if host is BlockPage host //
	// ------------------------- //
	isBlockPageHost: function (url)
	{
		
		if (url && url.toLowerCase() == Webroot_Helper.blockPageHost) return true;

		return false;
	},

	// ------------------------------------ //
	// Check if URL needs to be WhiteListed //
	// ------------------------------------ //
	isWhiteListUrl: function (uri)
	{
		var urlWithoutQuery = uri.urlWithoutQuery.toLowerCase();

		// Check URL
		if (urlWithoutQuery == Webroot_Helper.whitePagePath) return true;
		if (urlWithoutQuery == Webroot_Helper.whitePagePathHttps) return true;

		return false;
	},

	// ----------------------- //
	// Construct BLOCKPAGE URL //
	// ----------------------- //
	constructBlkUrl: function (responseMsg, isIframe) {
		var myBlockPageURL;
		var obj = responseMsg;

		if (isIframe) myBlockPageURL = Webroot_Helper.IframeblockPagePathHttps;
		else myBlockPageURL = Webroot_Helper.blockPagePathHttps;

		// Add <FLG>
		myBlockPageURL += '?q=' + responseMsg["V2BLOB"];
		// return BLOCKPAGE URL
		return myBlockPageURL;
	},

	// ------------------------- //
	// Extract page HTML content //
	// ------------------------- //
	extractPageHtml: function (document)
	{
		if (!document) return "";

		// Get Root Document HTML
		var RootHTML = "";
		if (document.head && document.head.outerHTML)
			RootHTML += document.head.outerHTML;
		if (document.body && document.body.outerHTML)
			RootHTML += document.body.outerHTML;

		if (RootHTML.length > 0) RootHTML = "<html>" + RootHTML + "</html>";

		return RootHTML;
	},

	// -------------------------------------------- //
	// Function to check for newTab links in chrome //
	// -------------------------------------------- //
	isNewTabPage: function(url){
		// Extract RegEx from Config File
		var newRegEx = new RegExp(".*www\\.google\\..*chrome/newtab.*", 'i');

		// Check URL against RegEx
		var result = url.match(newRegEx);

		if (result != null) return true;

		return false;
	},

	// public method for decoding
	decodeBase64: function (input)
	{
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		input = atob(input);
		input = decodeURIComponent(escape(input));
		return input;
	}
};
