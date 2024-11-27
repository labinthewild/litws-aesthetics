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
window.LITW = window.LITW || {}
window.$ = require("jquery");
window.jQuery = window.$;
require("../js/jquery.i18n");
require("../js/jquery.i18n.messagestore");
require("jquery-ui-bundle");
let Handlebars = require("handlebars");
window.$.alpaca = require("alpaca");
window.bootstrap = require("bootstrap");
window._ = require("lodash");

import * as litw_engine from "../js/litw/litw.engine.0.1.0";
LITW.engine = litw_engine;

//LOAD THE HTML FOR STUDY PAGES
import progressHTML from "../templates/progress.html";
Handlebars.registerPartial('prog', Handlebars.compile(progressHTML));
import introHTML from "./pages/introduction.html";
import irb_LITW_HTML from "../templates/irb2-litw.html";
import demographicsHTML from "../templates/demographics.html";
import instructionsHTML from "./pages/instructions.html";
import instructionsR1HTML from "./pages/instructions-round1.html";
import aestheticQuestionPracticeHTML from "./pages/aesthetic-question.html";
import aestheticQuestionR1HTML from "./pages/aesthetic-question.html";
import resultsHTML from "./pages/results.html";
import resultsFooterHTML from "../templates/results-footer.html";
import commentsHTML from "../templates/comments.html";

var introTemplate = Handlebars.compile(introHTML);
var irbTemplate = Handlebars.compile(irb_LITW_HTML);
var demographicsTemplate = Handlebars.compile(demographicsHTML);
var instructionsTemplate = Handlebars.compile(instructionsHTML);
var instructionsR1Template = Handlebars.compile(instructionsR1HTML);
var aestheticQuestionPractice = Handlebars.compile(aestheticQuestionPracticeHTML);
var aestheticQuestionR1 = Handlebars.compile(aestheticQuestionR1HTML);
var resultsTemplate = Handlebars.compile(resultsHTML);
var resultsFooter = Handlebars.compile(resultsFooterHTML);
var commentsTemplate = Handlebars.compile(commentsHTML);

import * as results_utils from "./js/results.mjs";
window.results_utils = results_utils;
import * as results_graphic from "./js/results-graph.mjs";
window.results_graphic = results_graphic;

module.exports = (function(exports) {
	const study_times = {
			SHORT: 5,
			MEDIUM: 10,
			LONG: 15,
		};
	let timeline = [];
	let config = {
		languages: {
			'default': 'en',
			'en': './i18n/en.json?v=1.0',
		},
		study_id: 'd3f0cbb6-a5b7-4944-a761-b862b8b93fb9',
		all_stimulus: {
			HH: ["HCL_HCM_4f8509dc.jpg", "HCL_HCM_4fb6fabe.jpg", "HCL_HCM_4fba15b4.jpg", "HCL_HCM_53fd3840.jpg", "HCL_HCM_532022ac.jpg"],
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
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: introTemplate,
				display_element_id: "intro",
				display_next_button: false,
			},
			INFORMED_CONSENT: {
				name: "informed_consent",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: irbTemplate,
				template_data: {
					time: study_times.MEDIUM,
				},
				display_element_id: "irb",
				display_next_button: false,
			},
			INSTRUCTIONS: {
				name: "instructions",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: instructionsTemplate,
				display_element_id: "instructions",
				display_next_button: false,
			},
			INSTRUCTIONS_R1: {
				name: "instructions_r1",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: instructionsR1Template,
				display_element_id: "instructions",
				display_next_button: false,
			},
			AESTHETIC_QUESTIONS_PRACTICE: {
				name: "aesthetic_practice",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: aestheticQuestionPractice,
				template_data:{},
				display_element_id: "aesthetic",
				display_next_button: false,
			},
			AESTHETIC_QUESTIONS_R1: {
				name: "aesthetic_r1",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: aestheticQuestionR1,
				template_data:{},
				display_element_id: "aesthetic",
				display_next_button: false,
				finish: function(){
					let stimulus_data = {
						responses: JSON.parse(JSON.stringify(config.responses))
					}
					LITW.data.submitStudyData(stimulus_data);
				}
			},
			DEMOGRAPHICS: {
				name: "demographics",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				template: demographicsTemplate,
				template_data: {
					local_data_id: 'LITW_DEMOGRAPHICS'
				},
				display_element_id: "demographics",
				finish: function(){
					let dem_data = $('#demographicsForm').alpaca().getValue();
					LITW.data.addToLocal(this.template_data.local_data_id, dem_data);
					LITW.data.submitDemographics(dem_data);
				}
			},
			COMMENTS: {
				name: "comments",
				type: LITW.engine.SLIDE_TYPE.SHOW_SLIDE,
				display_element_id: "comments",
				display_next_button: true,
				template: commentsTemplate,
				finish: function(){
					let comments = $('#commentsForm').alpaca().getValue();
					if (Object.keys(comments).length > 0) {
						LITW.data.submitComments({
							comments: comments
						});
					}
				}
			},
			RESULTS: {
				display_next_button: false,
				type: LITW.engine.SLIDE_TYPE.CALL_FUNCTION,
				setup: function(){
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
		config.stimulus_practice = practiceIndexes;
		return practiceIndexes;
	}

	function generateRoundStimuli(imagesPerGroup=1) {
		let stimuli = [];
		for(let collection in config.all_stimulus) {
			let shuffled = shuffleArray(config.all_stimulus[collection]);
			for(let stim of shuffled.splice(0, Math.min(imagesPerGroup, collection.length))) {
				stimuli.push(stim);
			}
		}
		stimuli.forEach(
			(value, index, array)=>{array[index] = `./img/stimuli/${value}`}
		)
		config.stimulus_rounds = stimuli;
		return stimuli;
	}

	function getPreLoad() {
		let baseline =  ["../img/btn-next.png", "../img/btn-next-active.png", "../img/ajax-loader.gif"];
		baseline = baseline.concat(generatePracticeStimuli());
		baseline = baseline.concat(generateRoundStimuli(2));
		return baseline;
	}

	function shuffleArray( array ) {
		return array
				.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value)
	}

	function configureTimeline() {
		// timeline.push(config.slides.INTRODUCTION);
		// timeline.push(config.slides.INFORMED_CONSENT);
		// timeline.push(config.slides.DEMOGRAPHICS);
		// timeline.push(config.slides.INSTRUCTIONS);
		// config.slides.AESTHETIC_QUESTIONS_PRACTICE.template_data = () => {
		// 	return { stimulus: {
		// 		round_name: $.i18n('study-instructions-phase-practice-title'),
		// 		phase_id: 'practice',
		// 		number: config.stimulus_practice.length,
		// 		names: config.stimulus_practice
		// 	}};
		// }
		// timeline.push(config.slides.AESTHETIC_QUESTIONS_PRACTICE);
		timeline.push(config.slides.INSTRUCTIONS_R1);
		config.slides.AESTHETIC_QUESTIONS_R1.template_data = () => {
			return {
				stimulus: {
					round_name: $.i18n('study-instructions-phase-r1-title'),
						phase_id: 'round1',
						number: config.stimulus_rounds.length,
						names: config.stimulus_rounds
				}
			}
		}
		timeline.push(config.slides.AESTHETIC_QUESTIONS_R1);
		timeline.push(config.slides.COMMENTS);
		timeline.push(config.slides.RESULTS);
		return timeline;
	}

	function calculateResults() {
		let results_data = config.responses;
		if (Object.keys(results_data).length === 0) {
			results_data = {
				practice:{practice1:"10",practice2:"9",practice3:"3",practice4:"4",practice5:"3"},
				round1:{HCL_HCM_4fba15b4:"4",HCL_LCM_53404dc0:"8",LCL_HCM_4ff2038e:"8",LCL_LCM_54058e00:"9"},
				round2:{HCL_HCM_4fb6fabe:"7",HCL_LCM_4f694e40:"6",LCL_HCM_53001fb6:"8",LCL_LCM_4fc40b8c:"9"}
			}
		}
		let all_responses = Object.assign({}, results_data.round1, results_data.round2);
		let img_ratings = {};
		for (let key of Object.keys(all_responses)){
    		let img_key = key.split('_')[2];
    		img_ratings[img_key] = parseInt(all_responses[key])
		}
		let part_data = {
			scores: results_utils.calculate_participant_score(img_ratings),
		}
		part_data.country = results_utils.findClosestCountry(part_data.scores.color, part_data.scores.complexity);
		showResults(part_data, true)
	}

	function showResults(results = {}, showFooter = false) {
		if('PID' in LITW.data.getURLparams) {
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
					more_litw_studies: config.study_recommendation
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

	function bootstrap() {
		let good_config = LITW.engine.configure_study(getPreLoad(), config.languages, configureTimeline());
		if (good_config){
			LITW.engine.start_study();
		} else {
			console.error("Study configuration error!");
			//TODO fail nicely, maybe a page with useful info to send to the tech team?
		}
	}



	// when the page is loaded, start the study!
	$(document).ready(function() {
		bootstrap();
	});
	exports.study = {};
	exports.study.params = config

})( window.LITW = window.LITW || {} );


