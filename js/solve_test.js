    const used_randoms = [];
const questions = [{
    body: `Agar uchburchakning burchaklari {a}, {b}
va {c} sonlariga proporsional bo’lsa, uchburchakning katta burchagini toping.`,
    number: "1",
    category: "math",
    tags: "masala",
    points: 3,
    variables: [{
        sign: "{a}",
        type: "Z",
        range: {min: 1, max: 10, type: "in"}
    },
        {
            sign: "{b}",
            type: "Z",
            range: {min: 1, max: 10, type: "in"}
        },
        {
            sign: "{c}",
            type: "Z",
            range: {min: 1, max: 10, type: "in"}
        }
    ],
    answer: {
        formula: "180*max({a},{b},{c})/({a}+{b}+{c})",
        type: "Z",
        range: {
            min: 0,
            max: 180,
            type: "ex" // in range[] and ex range()
        },
        value: 0
    },
    variants: [
        {
            index: 0,
            formula: "180*max3({a},{b},{c})/({a}+{b}+{c}) + 10",
            type: "Z",
            range: {
                min: 0,
                max: 180,
                type: "ex" // in range[] and ex range()
            },
            value: 0
        }, {
            index: 1,
            formula: "180*min3({a},{b},{c})/({a}+{b}+{c})",
            type: "Z",
            range: {
                min: 0,
                max: 180,
                type: "ex" // in range[] and ex range()
            },
            value: 0
        }, {
            index: 2,
            formula: "180*mid3({a},{b},{c})/({a}+{b}+{c})",
            type: "Z",
            range: {
                min: 0,
                max: 180,
                type: "ex" // in range[] and ex range()
            },
            value: 0
        }
    ]
}];

function btnClicked(indexBtn) {
    console.log(`${indexBtn} clicked`);
    let variant;
    if (indexBtn == 0) {
        variant = $(".var-a > *");
    }
    if (indexBtn === 1) {
        variant = $(".var-b > *");
    }
    if (indexBtn === 2) {
        variant = $(".var-c > *");
    }
    if (indexBtn === 3) {
        variant = $(".var-d > *");
    }
    console.log("variant", variant);
    variant.css("color", "green");
    for (let i = 0; i < 4; i++) {
        if (indexBtn === i) continue;
        let v = ['a', 'b', 'c', 'd'][i];
        $(`.var-${v} > *`).css("color", "white");
    }
}

function setQuestionNumber(num) {
    $(".q-num").text(`Question ${num}`);
}

function setQuestionCategory(category) {
    $(".q-category").text(`Category ${category}`);
}

function setQuestionPoints(points) {
    $(".q-points").text(`${points} pts`);
}

function setQuestionBody(body, randomVariables) {
    let variables = randomVariables.variables;
    for (let v of variables) {
        body = body.replaceAll(v.sign, v.value);
    }
    $(".question-body").html(`${body}`);
}

function evaluateAnswer(answer, randomVariables) {
    let vars = randomVariables.variables;
    let answerx = 180 / (vars[0].value + vars[1].value + vars[2].value) * Math.max(vars[0].value, vars[1].value, vars[2].value);
    return {
        value: answerx
    };
}

function evaluateVars(variants, randomVariables) {
    let vars = randomVariables.variables;
    let answerx = 180 / (vars[0].value + vars[1].value + vars[2].value) * Math.max(vars[0].value, vars[1].value, vars[2].value);
    let minx = 180 / (vars[0].value + vars[1].value + vars[2].value) * Math.min(vars[0].value, vars[1].value, vars[2].value);
    let midx = 180 - minx - answerx
    if (midx === minx) {
        midx -= 5;
    }
    if (midx === answerx) {
        midx -= 5;
    }
    return [{
        value: minx
    }, {
        value: midx
    }, {
        value: answerx + 5
    }];
}

function setQuestionVariants(answer, variants, randomVariables) {
    let answerValue = evaluateAnswer(answer, randomVariables);
    let variantsValue = evaluateVars(variants, randomVariables);
//  console.log("answer",answer);
//  console.log("answerValue",answerValue );
//  console.log("variants",variants);
//  console.log("randomVariables",randomVariables)

    variantsValue.push(answerValue);

    shuffle(variantsValue);

    for (let i = 0; i < 4; i++) {
        let s = ['a', 'b', 'c', 'd'];
        $(`.var-${s[i]} .var-body`).text(variantsValue[i].value);
    }
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function generateRandomVars(question) {
    if (question.number === '1') {
        let variables = question.variables;
        let result = [];
        let avar = variables[0];
        let bvar = variables[1];
        let cvar = variables[2];
        for (let a_val = avar.range.min; a_val <= avar.range.max; a_val++) {
            for (let b_val = bvar.range.min; b_val <= bvar.range.max; b_val++) {
                for (let c_val = cvar.range.min; c_val <= cvar.range.max; c_val++) {
                    if (180 % (a_val + b_val + c_val) === 0) {
                        result.push({
                            variables: [{
                                sign: avar.sign,
                                value: a_val
                            }, {
                                sign: bvar.sign,
                                value: b_val
                            }, {
                                sign: cvar.sign,
                                value: c_val
                            }]
                        })
                    }
                }
            }
        }
        shuffle(result);
        return result[0];
    }
}


$(document).ready(() => {
    let question = questions[0];

    let randomVariables = generateRandomVars(question)

    setQuestionNumber(question.number);

    setQuestionCategory(question.category);

    setQuestionPoints(question.points);

    setQuestionBody(question.body, randomVariables);

    setQuestionVariants(question.answer, question.variants, randomVariables);

})
