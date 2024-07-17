/**
 * DATA FROM: 
 * Katharina Reinecke and Krzysztof Z. Gajos. 
 * Quantifying visual preferences around the world. 
 * In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems, CHI '14, 
 * pages 11-20, New York, NY, USA, 2014. ACM.
 */

let website_scores = {
    "4f8509dc": { 'color': 4.7744057618, 'complexity': 7.0842378233 },
    "4fb6fabe": { 'color': 6.0793321804, 'complexity': 6.1878661439 },
    "4fba15b4": { 'color': 4.7440841477, 'complexity': 6.4573872587 },
    "532022ac": { 'color': 4.9750021303, 'complexity': 7.2318208198 },
    "53fd3840": { 'color': 7.0164903057, 'complexity': 6.3512124775 },
    "4ec913ee": { 'color': 4.3018017266, 'complexity': 3.9007701371 },
    "4f694e40": { 'color': 3.6996485733, 'complexity': 2.6523973798 },
    "4ff24812": { 'color': 3.7639944318, 'complexity': 3.9048744007 },
    "533d953a": { 'color': 3.9813882311, 'complexity': 3.6881911275 },
    "53404dc0": { 'color': 5.04365267, 'complexity': 3.8389932775 },
    "4eb64b10": { 'color': 0.376119441, 'complexity': 6.0718919037 },
    "4ff2038e": { 'color': 1.6162648787, 'complexity': 5.9068255434 },
    "53001fb6": { 'color': 2.1561616849, 'complexity': 5.7452912384 },
    "53900b76": { 'color': 2.0121925916, 'complexity': 5.7258703072 },
    "53d810ce": { 'color': 1.9785179454, 'complexity': 7.1774970952 },
    "4ec84fae": { 'color': 1.0933426531, 'complexity': 2.3011683415 },
    "4fc40b8c": { 'color': 0.1, 'complexity': 2.1450039608 },
    "53dfb4e6": { 'color': 1.3218037708, 'complexity': 2.3686750393 },
    "54058e00": { 'color': 0.4472927787, 'complexity': 2.1626792795 },
    "58872dc6": { 'color': 1.2623744008, 'complexity': 2.6099256526 },
}

let country_scores = {
    "Macedonia": {"color":7.62, "complexity":4.46},
    "Malaysia": {"color":6.97, "complexity":4.39},
    "Chile": {"color":6.95, "complexity":4.56},
    "Serbia": {"color":6.6, "complexity":4.77},
    "United Kingdom": {"color":6.52, "complexity":4.52},
    "Bosnia-Herzegovina": {"color":6.42, "complexity":4.69},
    "Singapore": {"color":6.39, "complexity":4.53},
    "Ireland": {"color":6.37, "complexity":4.29},
    "Mexico": {"color":6.36, "complexity":4.56},
    "Romania": {"color":6.3, "complexity":4.5},
    "China": {"color":6.27, "complexity":4.09},
    "Greece": {"color":6.21, "complexity":4.09},
    "Lithuania": {"color":6.15, "complexity":4.28},
    "United States": {"color":6.09, "complexity":4.15},
    "South Africa": {"color":5.94, "complexity":4.54},
    "Hungary": {"color":5.93, "complexity":4.54},
    "Philippines": {"color":5.9, "complexity":4.28},
    "Canada": {"color":5.89, "complexity":4.2},
    "Spain": {"color":5.76, "complexity":4.36},
    "India": {"color":5.73, "complexity":4.08},
    "New Zealand": {"color":5.73, "complexity":4.22},
    "Hong Kong": {"color":5.68, "complexity":3.54},
    "Italy": {"color":5.63, "complexity":3.74},
    "Argentina": {"color":5.62, "complexity":4.37},
    "Australia": {"color":5.53, "complexity":4.09},
    "Japan": {"color":5.36, "complexity":4.08},
    "Netherlands": {"color":5.35, "complexity":3.88},
    "Belgium": {"color":5.28, "complexity":3.85},
    "Brazil": {"color":5.15, "complexity":4},
    "Slovakia": {"color":5.11, "complexity":3.94},
    "Israel": {"color":5.08, "complexity":3.9},
    "Portugal": {"color":4.95, "complexity":3.99},
    "Norway": {"color":4.77, "complexity":3.86},
    "Bulgaria": {"color":4.63, "complexity":4.26},
    "Austria": {"color":4.55, "complexity":3.93},
    "Sweden": {"color":4.5, "complexity":3.39},
    "Germany": {"color":4.45, "complexity":3.75},
    "France": {"color":4.41, "complexity":3.78},
    "Switzerland": {"color":4.25, "complexity":3.7},
    "Denmark": {"color":4.24, "complexity":3.69},
    "Poland": {"color":3.83, "complexity":3.75},
    "Russia": {"color":3.62, "complexity":2.51},
    "Finland": {"color":3.56, "complexity":3.31}
}

/**
 * @attr ratings: dict = {img_id: score} [string: int]
 * @return {'color': float, 'complexity': float}
 */
function calculate_participant_score(ratings) {
    let color_vote_weight = Array(10).fill(0); //ignoring position 0 as no such vote exists
    let complex_vote_weight = Array(10).fill(0);
    for(let img_id in ratings) {
        if(img_id in website_scores) {
            let img_color_level = Math.round(website_scores[img_id]['color'])
            let img_complex_level = Math.round(website_scores[img_id]['complexity'])
            let img_rating_rescaled = ratings[img_id]-5
            color_vote_weight[img_color_level] += img_rating_rescaled
            complex_vote_weight[img_complex_level] += img_rating_rescaled
        }
    }
    console.log('color voting', color_vote_weight)
    console.log('complex voting', complex_vote_weight)
    let pick_vote = (acc, val, idx) => acc[0]>val ? acc : [val,idx]
    let scores = {
        'color': color_vote_weight.reduce(pick_vote, [-100,0])[1],
        'complexity': complex_vote_weight.reduce(pick_vote, [-100,0])[1]
    }

    return scores;
}

function findClosestCountry(color_score, complexity_score) {
    let closest_country = 'Not Found :('
    let closest_distance = 1000000;
    for (let country in country_scores) {
        let tmp_dist = Math.sqrt(
            ((country_scores[country].color - color_score) ** 2)
            + ((country_scores[country].complexity - complexity_score) ** 2));
        if(tmp_dist < closest_distance) {
            closest_distance = tmp_dist;
            closest_country = country;
        }
    }
    return closest_country;
}

export {calculate_participant_score, findClosestCountry, country_scores};
