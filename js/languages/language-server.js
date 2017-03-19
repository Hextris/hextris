/*
	Language Server for hextris.
	Allows to load languagre resources at runtime.

	From Thomas Roskop (Github: TRoskop).

	We have to ad every language (currently) to the index.html file to support the language.
	Moreover, we load only those variables we realy need.
*/

var ____LanguageServerResources = {};

/*
	This is a list of all the languages this app does currently support.
	If the user uses a language we do not support, load fallback language en-US.
*/
var ____LanguageServerLocales = [
	"en-US",
	"de-DE",
  "es-ES"
];

(function _LanguageServerInit() {
	var lang = navigator.language || navigator.userLanguage; /* form: "en-US" */
	var lngFound = false;
	for (var i = 0; i < ____LanguageServerLocales.length; i++) {
		if(____LanguageServerLocales[i] == lang) {
			lngFound = true; /* We found the language in the list so we support it. */
		}
	}

	// If we found no perfect match, let's look for a unexact match.
  // This means that we only compare the first two chars as they only indicate the language without the region.
  if(!lngFound) {
		for (var i = 0; i < ____LanguageServerLocales.length; i++) {
			var l1 = ____LanguageServerLocales[i].substring(0, 2); // e.g.: en
      if( lang.indexOf(l1) > -1 ) { // e.g.: if "en-es" contains "en" we have a match.
				lngFound = true; /* We found the language in the list so we support it. */
				lang = l1;
      }      
		}
  }
   
	if(!lngFound) lang = "en-US"; /* Use fallback language because no language was found! */

  // lang = "es-es"; // For development test, should uncomment this line AND use your (valid!) language!

	lang = lang.replace("-", "_").toUpperCase();

	console.log("language: " + lang);

  eval("____LanguageServerResources = ____LanguageServerResources" + lang + ";");
	/* Looks like: ____LanguageServerResources = ____LanguageServerResourcesEN_US; */
})();

/*
	Gets the string matching the key.
	If there is no string, simply return the key in brackets: '{key}'
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
