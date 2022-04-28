var used_randoms = [];
var questions = [{
  body :  `Agar uchburchakning burchaklari {a}, {b}
va {c} sonlariga proporsional bo’lsa, uchburchakning katta burchagini toping.`,
  number:"1",
  category:"math",
  tags:"masala",
  points:3,
  variables: [{
      sign:"{a}",
      type:"Z",
      range:{ min:1, max:10,type:"in"}
    },{
        sign:"{a}",
        type:"Z",
        range:{min:1,max:10,type:"in"}
      },
      {
        sign:"{b}",
        type:"Z",
        range:{min:1,max:10,type:"in"}
      },
      {
        sign:"{c}",
        type:"Z",
        range:{min:1,max:10,type:"in"}
      },
  ],
  answer:{
    formula:"180*max({a},{b},{c})/({a}+{b}+{c})",
    type:"Z",
    range:{
      min:0,
      max:180,
      type:"ex" // in range[] and ex range()
    },
    value:0
  },
  variants:[
    {
      index:0,
      formula:"180*max3({a},{b},{c})/({a}+{b}+{c}) + 10",
      type:"Z",
      range:{
        min:0,
        max:180,
        type:"ex" // in range[] and ex range()
      },
      value:0
    },{
      index:1,
      formula:"180*min3({a},{b},{c})/({a}+{b}+{c})",
      type:"Z",
      range:{
        min:0,
        max:180,
        type:"ex" // in range[] and ex range()
      },
      value:0
    },{
      index:2,
      formula:"180*mid3({a},{b},{c})/({a}+{b}+{c})",
      type:"Z",
      range:{
        min:0,
        max:180,
        type:"ex" // in range[] and ex range()
      },
      value:0
    }
  ]
}];

function btnClicked(indexBtn){
    console.log(`${indexBtn} clicked`);
    let variant;
    if (indexBtn == 0){
        variant = $(".var-a > *");
    }
    if (indexBtn == 1){
        variant = $(".var-b > *");
    }
    if (indexBtn == 2){
        variant = $(".var-c > *");
    }
    if (indexBtn == 3){
        variant = $(".var-d > *");
    }
    console.log("variant",variant);
    variant.css("color","green");
    for (let i=0;i<4;i++){
        if (indexBtn == i) continue;
        let v = ['a','b','c','d'][i];
        $(`.var-${v} > *`).css("color","white");
    }
}

function setQuestionNumber(num){
   console.log("num",num);
    $(".q-num").text(`Question ${num}`);
    console.log("q-num",$(".q-num"))
}

function setQuestionCategory(category) {
      $(".q-category").text(`Category ${category}`);
}

function setQuestionPoints(points) {
      $(".q-points").text(`${points} pts`);
}

function setQuestionBody(body,randomVariables) {
    let variables = randomVariables.variables;
    for (let v of variables){
      body =  body.replaceAll(v.sign,v.value);
    }
    $(".question-body").html(`${body}`);
}

function setQuestionVariants(answer,variants,randomVariables) {
  let answerValue = evaluateAnswer(answer,randomVariables);
  let variantsValue = evaluateVars(variants,randomVariables);
}

function generateRandomVars(question) {
  // pass

  return {
    // variants:[{
    //     index:1,
    //     value:50
    //   },
    //   {
    //     index:0,
    //     value:80
    //   },
    //   {
    //     index:2,
    //     value:60
    //   },
    // ],
    variables:[
      {
        sign:"{a}",
        value:5
      },
      {
        sign:"{b}",
        value:6
      },
      {
        sign:"{c}",
        value:7
      }
    ]
  }
}


$(document).ready(()=>{
  console.log("ready")
  let question = questions[0];

  let randomVariables = generateRandomVars(question)
  console.log(randomVariables)
  setQuestionNumber(question.number);
  setQuestionCategory(question.category);
  setQuestionPoints(question.points);
  setQuestionBody(question.body,randomVariables);
  setQuestionVariants(question.answer,question.variants,randomVariables);

})
