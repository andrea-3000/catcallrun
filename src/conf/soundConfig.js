var MUSIC_VOLUME = 0.5;
var SOUND_VOLUME = 1.0;

exports = {
	music: {
		'menu': {
			background: true,
			volume: MUSIC_VOLUME
		},
		'bgm': {
			sources: ['penguin_music_themeB_02'],
			background: true,
			volume: 0.2
		}
	},
	musicPath: 'resources/music',
	sfx: {
		'hazard': {
			sources: [
				'sfx_crash_a',
				'sfx_crash_b',
				'sfx_crash_c'
			],
			volume: 0.9
		},
		'bubbleMake': { sources: [
			'sfx_honey_a',
			'sfx_honey_b',
			'sfx_honey_c'
		] },
		'countdown': {
			sources: ['sfx_countdown'],
			volume: 0.35
		},
		'shield': {
			sources: ['sfx_shield'],
			volume: 0.5
		},
		'ready': { sources: ['readyGo'] },
		'button_back': { sources: ['sfx_button_back'] },
		'button_fore': { sources: ['sfx_button_fore'] },
		'points': { sources: [
			'sfx_points_0',
			'sfx_points_1',
			'sfx_points_2',
			'sfx_points_3',
			'sfx_points_4',
			'sfx_points_5',
			'sfx_points_6',
			'sfx_points_7',
			'sfx_points_8'
		] },
		'button_up': { sources: ['buttonSquishUp'] },
		'hurryUp': { sources: ['hurryUp'] },
		'fever': {
			sources: [
				'fever_a',
				'fever_b',
				'fever_c'
			],
			volume: 1.5
		},
	},
	sfxPath: 'resources/audio'
};
