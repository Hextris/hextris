/*
	Language Server for hextris.
	Allows to load languagre resources at runtime.

  Language: DE-DE (Germany's german) @Übersetzung von: Thomas Roskop
*/



____LanguageServerResourcesDE_DE = {
  "AppName": "Hextris",
  "AppDescription": "Ein süchtig machendes Spiel von Tetris inspiriert.",
  "GameOver": "VERLOREN",
  "HighScore": "BESTE BEWERTUNG",
  "HighScores": "BESTE BEWERTUNGEN",
  "ShareMyScore": "MEINE PUNKTZAHL TEILEN",
  "ShareButtons": "TEILEN",

  'paused': "<div class='centeredHeader unselectable'>Spiel pausiert</div>",
  'pausedAndroid': "<div class='centeredHeader unselectable'>Spiel pausiert.</div><div class='unselectable centeredSubHeader' style='position:absolute;margin-left:-150px;left:50%;margin-top:20px;width:300px;font-size:16px;'><a href = 'https://play.google.com/store/apps/details?id=com.hextris.hextrisadfree' target='_blank'>Du möchtest den Entwickler unterstützen? Du magst keine Werbung? Tippe hier für die werbefreie Version!</a></div>",
  'pausediOS': "<div class='centeredHeader unselectable'>Spiel pausiert</div><div class='unselectable centeredSubHeader' style='position:absolute;margin-left:-150px;left:50%;margin-top:20px;width:300px;font-size:16px;'><a href = 'https://itunes.apple.com/us/app/hextris-ad-free/id912895524?mt=8' target='_blank'>Du möchtest den Entwickler unterstützen? Du magst keine Werbung? Tippe hier für die werbefreie Version!</a></div>",
  'pausedOther': "<div class='centeredHeader unselectable'>Spiel pausiert</div><div class='unselectable centeredSubHeader' style='margin-top:10px;position:absolute;left:50%;margin-left:-190px;max-width:380px;font-size:18px;'><a href = 'http://hextris.github.io/' target='_blank'>Du möchtest den Entwickler unterstützen? Du magst keine Werbung? Tippe hier für die werbefreie Version!</a></div>",
  'start': "<div class='centeredHeader unselectable' style='line-height:80px;'>Drücke die Eingabetaste zum weitermachen.</div>",

  "input_text": "Drücke die rechte und linke Pfeiltaste",
  "action_text": "um das Hexagon zu drehen.",
  "score_text": "Verbinde 3+ gleichfarbige Blöcke um Punkte zu sammeln.",
  /* Mobile version */
  "input_textM": "Drücke auf die rechte und linke Seite",
  "action_textM": "um das Hexagon zu drehen.",
  "score_textM": "Verbinde 3+ gleichfarbige Blöcke um Punkte zu sammeln.",

  /* Only access this with "_SEval()" */
  "Instructions": "<div id = 'instructions_head'>HINWEISE ZUM SPIEL!</div><p>Ziel des Spieles ist es zu verhindern, dass die farbigen Balken den grauen Bereich verlassen.</p><p>\" + (settings.platform != 'mobile' ? 'Drücke dazu die rechte und linke Pfeiltaste' : 'Tippe auf die linke oder rechte Seite des Bildschirms') + \" um das Hexagon zu bewegen.</p><p>Die Blöcke verschwinden, wenn drei oder mehr der gleichn Farbe sich dirket berühren.</p><p>Die Zeit, bis deine Mehrfachattacke zuende ist, wird durch <span style='color:#f1c40f;'>die</span> <span style='color:#e74c3c'>bunten</span> <span style='color:#3498db'>Linien</span> <span style='color:#2ecc71'>an der Seite</span> des Hexagons angezeigt.</p> <hr> <p id = 'afterhr'></p> Von <a href='http://loganengstrom.com' target='_blank'>Logan Engstrom</a> & <a href='http://github.com/garrettdreyfus' target='_blank'>Garrett Finucane</a><br>Besuche Hextris auf <a href = 'https://itunes.apple.com/us/app/id903769553?mt=8' target='_blank'>iOS</a> & <a href ='https://play.google.com/store/apps/details?id=com.hextris.hextris' target='_blank'>Android</a><br><a href ='http://hextris.github.io/' target='_blank'>Hextris auf Github!</a>"
};
