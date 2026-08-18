/* Hextris i18n
 * Adds a language option to the game. English stays the default/primary
 * interface, and 简体中文 is available as an optional language.
 * This module only localizes strings; it does not change any game logic.
 */
var I18N = (function() {
	'use strict';

	var DICT = {
		'en': {
			// static screens (index.html)
			'highScore': 'HIGH SCORE',
			'gameOver': 'GAME OVER',
			'highScores': 'HIGH SCORES',
			'shareMyScore': 'SHARE MY SCORE!',
			'rank1': '1st: ',
			'rank2': '2nd: ',
			'rank3': '3rd: ',
			'play': 'Play!',
			// help screen (js/main.js showHelp)
			'howToPlay': 'HOW TO PLAY',
			'goal': 'The goal of Hextris is to stop blocks from leaving the inside of the outer gray hexagon.',
			'rotateDesktop': 'Press the right and left arrow keys',
			'rotateMobile': 'Tap the left and right sides of the screen',
			'rotateSuffix': ' to rotate the Hexagon.',
			'speedUpDesktop': ' Press the down arrow to speed up the block falling',
			'clearBlocks': 'Clear blocks and get points by making 3 or more blocks of the same color touch.',
			'comboHint': 'Time left before your combo streak disappears is indicated by <span style=\'color:#f1c40f;\'>the</span> <span style=\'color:#e74c3c\'>colored</span> <span style=\'color:#3498db\'>lines</span> <span style=\'color:#2ecc71\'>on</span> the outer hexagon',
			'creditsBy': 'By',
			'findOn': 'Find Hextris on',
			'moreAt': 'More @ the',
			// pause / overlay messages (js/view.js showText)
			'paused': 'Game Paused',
			'pausedSupport': 'Want to support the developers? Don\'t like ads? Tap for Hextris ad-free!',
			'pausedSupportOther': 'Want to support the developers? Click here to buy one of the ad-free mobile versions!',
			'pressEnter': 'Press enter to start',
			// beginning hint text (js/render.js renderBeginningText)
			'beginTap1': 'Tap the screen\'s left and right',
			'beginTap2': 'sides to rotate the hexagon',
			'beginScore': 'Match 3+ blocks to score',
			'beginKey1': 'Use the right and left arrow keys',
			'beginKey2': 'to rotate the hexagon',
			'beginScoreKey': 'Match 3+ blocks to score!'
		},
		'zh': {
			'highScore': '最高分',
			'gameOver': '游戏结束',
			'highScores': '高分榜',
			'shareMyScore': '分享我的分数！',
			'rank1': '第一名：',
			'rank2': '第二名：',
			'rank3': '第三名：',
			'play': '开始游戏！',
			'howToPlay': '玩法说明',
			'goal': 'Hextris 的目标是阻止方块离开外圈灰色六边形的内部。',
			'rotateDesktop': '使用左右方向键',
			'rotateMobile': '点击屏幕左右两侧',
			'rotateSuffix': '来旋转六边形。',
			'speedUpDesktop': '按下方向键 ↓ 可加速方块下落。',
			'clearBlocks': '让 3 个或更多同色方块相连，即可消除并获得分数。',
			'comboHint': '连击即将结束前剩余的时间，由外圈六边形上的<span style=\'color:#f1c40f;\'>黄</span><span style=\'color:#e74c3c\'>色</span><span style=\'color:#3498db\'>线</span><span style=\'color:#2ecc71\'>条</span>提示',
			'creditsBy': '作者',
			'findOn': '在以下平台找到 Hextris',
			'moreAt': '更多信息请访问',
			'paused': '游戏已暂停',
			'pausedSupport': '想支持开发者？不喜欢广告？点击购买 Hextris 无广告版！',
			'pausedSupportOther': '想支持开发者？点击这里购买无广告移动版本！',
			'pressEnter': '按 Enter 键开始',
			'beginTap1': '点击屏幕左右两侧',
			'beginTap2': '即可旋转六边形',
			'beginScore': '三个同色方块相连即可得分',
			'beginKey1': '使用左右方向键',
			'beginKey2': '旋转六边形',
			'beginScoreKey': '三个同色方块相连即可得分！'
		}
	};

	var STORAGE_KEY = 'hextris_lang';
	var currentLang = 'en';

	function getDefaultLang() {
		// English remains the primary interface; a user-chosen language is remembered.
		try {
			var saved = localStorage.getItem(STORAGE_KEY);
			if (saved === 'en' || saved === 'zh') {
				return saved;
			}
		} catch (e) { /* localStorage unavailable */ }
		return 'en';
	}

	function t(key) {
		var table = DICT[currentLang] || DICT.en;
		if (table && table[key] !== undefined) {
			return table[key];
		}
		if (DICT.en[key] !== undefined) {
			return DICT.en[key];
		}
		return key;
	}

	function applyLang() {
		var setText = function(id, key) {
			var el = document.getElementById(id);
			if (el) {
				el.textContent = t(key);
			}
		};

		setText('HIGHSCORE', 'highScore');
		setText('highScoreInGameTextHeader', 'highScore');
		setText('gameOverBox', 'gameOver');
		setText('highScoresTitle', 'highScores');
		setText('rank1Label', 'rank1');
		setText('rank2Label', 'rank2');
		setText('rank3Label', 'rank3');
		var share = document.getElementById('shareMyScoreText');
		if (share) {
			share.textContent = t('shareMyScore');
		}

		// reflect language in the <html> element
		document.documentElement.lang = currentLang;

		// highlight the active language button
		var btns = document.querySelectorAll('#langToggle .lang-btn');
		for (var i = 0; i < btns.length; i++) {
			var btn = btns[i];
			if (btn.getAttribute('data-lang') === currentLang) {
				btn.classList.add('active');
			} else {
				btn.classList.remove('active');
			}
		}
	}

	function setLang(lang, persist) {
		if (lang !== 'en' && lang !== 'zh') {
			lang = 'en';
		}
		currentLang = lang;
		if (persist !== false) {
			try {
				localStorage.setItem(STORAGE_KEY, lang);
			} catch (e) { /* localStorage unavailable */ }
		}
		applyLang();
	}

	// wire up the language toggle (runs after the DOM elements above exist)
	function init() {
		currentLang = getDefaultLang();
		var btns = document.querySelectorAll('#langToggle .lang-btn');
		for (var i = 0; i < btns.length; i++) {
			(function(btn) {
				btn.addEventListener('click', function() {
					setLang(btn.getAttribute('data-lang'), true);
				});
			})(btns[i]);
		}
		applyLang();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	return {
		t: t,
		getLang: function() {
			return currentLang;
		},
		setLang: setLang,
		apply: applyLang
	};
})();
