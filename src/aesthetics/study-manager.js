/*************************************************************
 * Main code, responsible for configuring the steps and their
 * actions.
 *
 * Author: LITW Team.
 *
 * © Copyright 2017-2024 LabintheWild.
 * For questions about this file and permission to use
 * the code, contact us at tech@labinthewild.org
 *************************************************************/

// load webpack modules
window.$ = require("jquery");
window.jQuery = window.$;
require("../js/jquery.i18n");
require("../js/jquery.i18n.messagestore");
require("jquery-ui-bundle");
require("handlebars");
window.$.alpaca = require("alpaca");
window.bootstrap = require("bootstrap");
window._ = require("lodash");

var introTemplate = require("./pages/introduction.html");
var irbTemplate = require("../templates/irb.html");
var demographicsTemplate = require("../templates/demographics.html");
var instructionsTemplate = require("./pages/instructions.html");
var instructionsR1Template = require("./pages/instructions-round1.html");
var aestheticQuestionPractice = require("./pages/aesthetic-question.html")
var aestheticQuestionR1 = require("./pages/aesthetic-question.html")
var loadingTemplate = require("../templates/loading.html");
var resultsTemplate = require("../templates/results.html");
var resultsFooter = require("../templates/results-footer.html");
var commentsTemplate = require("../templates/comments.html");
require("../js/litw/jspsych-display-info");
require("../js/litw/jspsych-display-slide");

//TODO: document "params.study_id" when updating the docs/7-ManageData!!!
module.exports = (function(exports) {
	var timeline = [],
	params = {
		study_id: "TO_BE_ADDED_IF_USING_LITW_INFRA",
		all_stimulus: {
			HH: ["HCL_HCM_4f8509dc.jpg", "HCL_HCM_4fb6fabe.jpg", "HCL_HCM_4fba15b4.jpg", "HCL_HCM_53fd3840.jpg", "HCL_HCM_532022ac.jpg]"],
			HL: ["HCL_LCM_4ec913ee.jpg", "HCL_LCM_4f694e40.jpg", "HCL_LCM_4ff24812.jpg", "HCL_LCM_533d953a.jpg", "HCL_LCM_53404dc0.jpg"],
			LH: ["LCL_HCM_4eb64b10.jpg", "LCL_HCM_4ff2038e.jpg", "LCL_HCM_53d810ce.jpg", "LCL_HCM_53001fb6.jpg", "LCL_HCM_53900b76.jpg"],
			LL: ["LCL_LCM_4ec84fae.jpg", "LCL_LCM_4fc40b8c.jpg", "LCL_LCM_53dfb4e6.jpg", "LCL_LCM_54058e00.jpg", "LCL_LCM_58872dc6.jpg"]
		},
		stimulus_practice: [],
		stimulus_rounds: [],
		responses: {},
		slides: {
			INTRODUCTION: {
				name: "introduction",
				type: "display-slide",
				template: introTemplate,
				display_element: $("#intro"),
				display_next_button: false,
			},
			INFORMED_CONSENT: {
				name: "informed_consent",
				type: "display-slide",
				template: irbTemplate,
				display_element: $("#irb"),
				display_next_button: false,
			},
			INSTRUCTIONS: {
				name: "instructions",
				type: "display-slide",
				template: instructionsTemplate,
				display_element: $("#instructions"),
				display_next_button: false,
			},
			INSTRUCTIONS_R1: {
				name: "instructions_r1",
				type: "display-slide",
				template: instructionsR1Template,
				display_element: $("#instructions"),
				display_next_button: false,
			},
			AESTHETIC_QUESTIONS_PRACTICE: {
				name: "aesthetic_practice",
				type: "display-slide",
				template: aestheticQuestionPractice,
				template_data:{},
				display_element: $("#aesthetic"),
				display_next_button: false,
			},
			AESTHETIC_QUESTIONS_R1: {
				name: "aesthetic_r1",
				type: "display-slide",
				template: aestheticQuestionPractice,
				template_data:{},
				display_element: $("#aesthetic"),
				display_next_button: false,
			},
			DEMOGRAPHICS: {
				type: "display-slide",
				template: demographicsTemplate,
				display_element: $("#demographics"),
				name: "demographics",
				finish: function(){
					var dem_data = $('#demographicsForm').alpaca().getValue();
					LITW.data.submitDemographics(dem_data);
				}
			},
			COMMENTS: {
				type: "display-slide",
				template: commentsTemplate,
				display_element: $("#comments"),
				name: "comments",
				finish: function(){
					var comments = $('#commentsForm').alpaca().getValue();
					if (Object.keys(comments).length > 0) {
						LITW.data.submitComments({
							comments: comments
						});
					}
				}
			},
			RESULTS: {
				type: "call-function",
				func: function(){
					calculateResults();
				}
			}
		}
	};

	function generatePracticeStimuli(){
		let practiceIndexes = Array(5).fill().map((_, i) => i+1);
		practiceIndexes.forEach(
			(value, index, array)=>{array[index] = `./img/stimuli/practice${value}.jpg`}
		)
		return practiceIndexes;
	}

	function generateRoundStimuli(sizePerGroup=1) {
		let stimuli = [];
		for(let collection in params.all_stimulus) {
			let shuffled = shuffleArray(params.all_stimulus[collection]);
			stimuli.push(shuffled.splice(0, Math.min(sizePerGroup, collection.length)));
		}
		stimuli.forEach(
			(value, index, array)=>{array[index] = `./img/stimuli/${value}`}
		)
		return stimuli;
	}

	function getPreLoad() {
		let baseline =  ["../img/btn-next.png", "../img/btn-next-active.png", "../img/ajax-loader.gif"];
		baseline = baseline.concat(params.stimulus_practice);
		baseline = baseline.concat(params.stimulus_rounds);
		return baseline;
	}

	function shuffleArray( array ) {
		return array
				.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)
	}

	function configureStudy() {
		params.stimulus_practice = generatePracticeStimuli();
		params.stimulus_rounds = generateRoundStimuli();

		// timeline.push(params.slides.INTRODUCTION);
		// timeline.push(params.slides.INFORMED_CONSENT);
		timeline.push(params.slides.INSTRUCTIONS);
		params.slides.AESTHETIC_QUESTIONS_PRACTICE.template_data = {
			stimulus: {
				round_name: $.i18n('study-instructions-phase-practice-title'),
				phase_id: 'practice',
				number: params.stimulus_practice.length,
				names: params.stimulus_practice
			}
		}
		timeline.push(params.slides.AESTHETIC_QUESTIONS_PRACTICE);
		timeline.push(params.slides.INSTRUCTIONS_R1);
		params.slides.AESTHETIC_QUESTIONS_R1.template_data = {
			stimulus: {
				round_name: $.i18n('study-instructions-phase-r1-title'),
				phase_id: 'round1',
				number: params.stimulus_rounds.length,
				names: params.stimulus_rounds
			}
		}
		timeline.push(params.slides.AESTHETIC_QUESTIONS_R1);
		// timeline.push(params.slides.DEMOGRAPHICS);
		// timeline.push(params.slides.COMMENTS);
		// timeline.push(params.slides.RESULTS);
	}

	function calculateResults() {
		let results_data = params.responses;
		if (Object.keys(results_data).length == 0) {
			results_data = {
				practice:{practice1:"10",practice2:"9",practice3:"3",practice4:"4",practice5:"3"},
				round1:{HCL_HCM_4fba15b4:"4",HCL_LCM_53404dc0:"8",LCL_HCM_4ff2038e:"8",LCL_LCM_54058e00:"9"},
				round2:{HCL_HCM_4fb6fabe:"7",HCL_LCM_4f694e40:"6",LCL_HCM_53001fb6:"8",LCL_LCM_4fc40b8c:"9"}
			}
		}
		all_responses = Object.assign({}, results_data.round1, results_data.round2);
		scores = {};
		for (key of Object.keys(all_responses)){
    		img_key = key.split('_')[2];
    		scores[img_key] = parseInt(all_responses[key])
		}
		showResults(results_data, true)
	}

	function showResults(results = {}, showFooter = false) {
		if('PID' in params.URL) {
			//REASON: Default behavior for returning a unique PID when collecting data from other platforms
			results.code = LITW.data.getParticipantId();
		}

		$("#results").html(
			resultsTemplate({
				data: results
			}));
		if(showFooter) {
			$("#results-footer").html(resultsFooter(
				{
					share_url: window.location.href,
					share_title: $.i18n('litw-irb-header'),
					share_text: $.i18n('litw-template-title'),
					more_litw_studies: params.study_recommendation
				}
			));
		}
		$("#results").i18n();
		LITW.utils.showSlide("results");
	}

	function readSummaryData() {
		$.getJSON( "summary.json", function( data ) {
			//TODO: 'data' contains the produced summary form DB data
			//      in case the study was loaded using 'index.php'
			//SAMPLE: The example code gets the cities of study partcipants.
			console.log(data);
		});
	}

	function startStudy() {
		// generate unique participant id and geolocate participant
		LITW.data.initialize();
		// save URL params
		params.URL = LITW.utils.getParamsURL();
		if( Object.keys(params.URL).length > 0 ) {
			LITW.data.submitData(params.URL,'litw:paramsURL');
		}
		// populate study recommendation
		LITW.engage.getStudiesRecommendation(2, (studies_list) => {
			params.study_recommendation = studies_list;
		});
		// initiate pages timeline
		jsPsych.init({
		  timeline: timeline
		});
	}

	function startExperiment(){
		//TODO These methods should be something like act1().then.act2().then...
		//... it is close enough to that... maybe the translation need to be encapsulated next.
		// get initial data from database (maybe needed for the results page!?)
		//readSummaryData();

		// determine and set the study language
		$.i18n().locale = LITW.locale.getLocale();
		var languages = {
			'en': './i18n/en.json?v=1.0',
			'pt': './i18n/pt-br.json?v=1.0',
		};
		//TODO needs to be a little smarter than this when serving specific language versions, like pt-BR!
		var language = LITW.locale.getLocale().substring(0,2);
		var toLoad = {};
		if(language in languages) {
			toLoad[language] = languages[language];
		} else {
			toLoad['en'] = languages['en'];
		}
		$.i18n().load(toLoad).done(
			function() {
				$('head').i18n();
				$('body').i18n();

				LITW.utils.showSlide("img-loading");
				//start the study when resources are preloaded
				configureStudy();
				let preLoadList = getPreLoad();
				jsPsych.pluginAPI.preloadImages(preLoadList,
					function () {
						startStudy();
					},

					// update loading indicator
					function (numLoaded) {
						$("#img-loading").html(loadingTemplate({
							msg: $.i18n("litw-template-loading"),
							numLoaded: numLoaded,
							total: preLoadList.length
						}));
					}
				);
			});
	}



	// when the page is loaded, start the study!
	$(document).ready(function() {
		startExperiment();
	});
	exports.study = {};
	exports.study.params = params

})( window.LITW = window.LITW || {} );


