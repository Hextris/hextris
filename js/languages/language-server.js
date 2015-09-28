/*
	Language Server for hextris.
	Allows to load languagre resources at runtime.

	von Thomas Roskop.

	We have to ad every language (currently) to the index.html file to support the language.
	Moreover, we load only those variables we realy need.
*/

var ____LanguageServerResources = null;

/*
	This is a list of all the languages this app does currently support.
	If the user uses a language we do not support, load fallback language en-US.
*/
var ____LanguageServerLocales = [
	"en-US",
	"de-DE"
];

(function _LanguageServerInit() {
	var lang = navigator.language || navigator.userLanguage; /* form: "en-US" */
	var lngFound = false;
	for (var i = 0; i < ____LanguageServerLocales.length; i++) {
		if(____LanguageServerLocales[i] == lang) {
			lngFound = true; /* We found the language in the list so we support it. */
		}
	}
	if(!lngFound) lang = "en-US"; /* Use Fallback language */

	lang = "de-DE";

	lang = lang.replace("-", "_").toUpperCase();

	console.log("language: " + lang);

  eval("____LanguageServerResources = ____LanguageServerResources" + lang + ";");
	/* Looks like: ____LanguageServerResources = ____LanguageServerResourcesEN_US; */
})();

/*
	Gets the string matching the key.
	If there is no string, simply return the key in brackets: '{' and '}'
*/
function _S(key) {
	return ____LanguageServerResources[key] || "{" + key + "}";
}

function _SEval(key) {
	return eval(_S(key));
}

function _SText(key, elementID) {
	var d = document.getElementById(elementID);
	if(d != null) { d.textContent = _S(key); }
}

function _SWrite(key) {
	document.write(_S(key));
}
