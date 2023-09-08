let currentQuestion = 0;
let numCorrect = 0;

function showQuestion(index) {
    // Hide all questions
    let questions = document.querySelectorAll('#questions .question');
    questions.forEach(q => q.style.display = 'none');
    
    // Show the current question
    questions[index].style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= document.querySelectorAll('#questions .question').length) {
        currentQuestion = 0;
    }
    showQuestion(currentQuestion);
}

function toggleText(id) {
    let element = document.getElementById(id);
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

const __version__ = "1.0"
updateVersion(id, __version__)

/* initialize jsPsych */
var jsPsych = initJsPsych({
    on_finish: function() {
      endExperiment(id)
    }
  });

async function initializeTimeline() {
  /* create timeline */
  var timeline = [];

  /* preload videos */
  const videos = ['mov/61.mp4', 'mov/130.mp4', 'mov/131.mp4'];
  const videourls = translateUrls(videos);
  var preload = {
    type: jsPsychPreload,
    videos: Object.values(videourls),
    data: {type: 'fnc_call'}
  };
  timeline.push(preload);


  /* Load the consent form */
  var consent = await makeConsent()
  timeline.push(consent)

  timeline.push(await startIntroduction(id))



  /* define welcome message trial */
  var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Welcome!\nWe are conducting a study on how people understand physical and social situations.\nYou will be shown 10 short videos of people interacting with objects and asked to answer questions about them.\nPress any key to begin.",
    data: {type: 'introduction'},
  };
  timeline.push(welcome);

  /* define instructions trial */
  var instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
      <p>In this experiment, you will view 10 video clips. Each clip will begin from a specific time step, but you can view earlier parts of the clip by hovering over the video.</p> 
      <p>Beside each clip, there's a button that displays the states and actions of the scenario. You can use this button to toggle bewteen showing or hiding the states and actions.</p>
      <p>Beneath these buttons, there's a question concerning the beliefs and intentions of the individuals in the video. Respond to the question by pressing 'a' or 'b', based on which answer you believe is most appropriate.</p>
      <p>Press any key to begin.</p>
    `,
    post_trial_gap: 2000,
    data: {type: 'introduction'}
  };
  timeline.push(instructions);

  timeline.push(await endIntroduction(id))


  /* Add a "Begin Experiment" button trial */
  var beginExperiment = {
    type: jsPsychHtmlButtonResponse,
    stimulus: 'Click the button below to begin the experiment.',
    choices: ['Begin'],
    data: {type: 'begin_experiment'},
    on_finish: function() {
      // This ensures that a user gesture has been made before any audio or video is played
    }
  };
  timeline.push(beginExperiment);

  /* video and question trial */
  var vqa1 = {
    // episode: 61  question type: 1.2  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/61.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <br>
    <button onclick="toggleText('stateText')">What's inside the apartment</button>
    <button onclick="toggleText('actionText')">Actions taken by Mary</button>
    <div id="stateText" style="display:none;">There is a bedroom, kitchen, bathroom, and living room. <br>
    In the bedroom, there is a coffee table and a desk. A remote control is on the coffee table. <br>
    The kitchen contains four cabinets, a fridge, a kitchen table, a stove, and a microwave. The third cabinet, from left to right, is empty. The fridge contains a dish bowl, two plates, and a bottle of wine. The fourth cabinet, from left to right, has a water glass. The stove holds a salmon, two cupcakes, and a plate. The second cabinet, from left to right, has a condiment bottle. The microwave has a cupcake. The first cabinet, from left to right, is empty. <br>
    The bathroom has a bathroom cabinet, which is empty. <br>
    The living room has a coffee table, cabinet, desk, and sofa. The coffee table has a wine glass and a book. The cabinet contains chips, an apple, a water glass, two plates, a bottle of wine, two wine glasses, a condiment bottle, and a remote control. </div>
    <div id="actionText" style="display:none;">Mary is in the bathroom. She walks to the kitchen and heads towards the stove, preparing to open it. </div>
    <br>
    <p>If Mary has been trying to get a wine, which one of the following statements is more likely to be true?<br>
    (a) Mary thinks that the wine is inside the stove. <br>
    (b) Mary thinks that the wine is not inside the stove.
    </p>
    `,
    choices: ['a', 'b'],
    correct_response: 'a',
    on_finish: function(data) {

      jsPsych.data.addDataToLastTrial({
        correct: data.response == vqa1.correct_response
      });
    
    }
  };

  var vqa2 = {
    // episode: 61  question type: 1.2  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/61.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <br>
    <button onclick="toggleText('stateText')">What's inside the apartment</button>
    <button onclick="toggleText('actionText')">Actions taken by Mary</button>
    <div id="stateText" style="display:none;">There is a bedroom, kitchen, bathroom, and living room. <br>
    In the bedroom, there is a coffee table and a desk. A remote control is on the coffee table. <br>
    The kitchen contains four cabinets, a fridge, a kitchen table, a stove, and a microwave. The third cabinet, from left to right, is empty. The fridge contains a dish bowl, two plates, and a bottle of wine. The fourth cabinet, from left to right, has a water glass. The stove holds a salmon, two cupcakes, and a plate. The second cabinet, from left to right, has a condiment bottle. The microwave has a cupcake. The first cabinet, from left to right, is empty. <br>
    The bathroom has a bathroom cabinet, which is empty. <br>
    The living room has a coffee table, cabinet, desk, and sofa. The coffee table has a wine glass and a book. The cabinet contains chips, an apple, a water glass, two plates, a bottle of wine, two wine glasses, a condiment bottle, and a remote control. </div>
    <div id="actionText" style="display:none;">Mary is in the bathroom. She then walks to the kitchen, heading towards the stove and opening it before closing it. She then moves to the second cabinet, opening and closing it, followed by the third cabinet. Finally, she approaches the first cabinet, ready to open it. </div>
    <br>
    <p>If Mary has been trying to get a wine, which one of the following statements is more likely to be true? <br>
    (a) Mary thinks that the wine is inside the 1st kitchencabinet. <br>
    (b) Mary thinks that the wine is not inside the 1st kitchencabinet.</p>
    `,
    choices: ['a', 'b'],
    correct_response: 'a',
    on_finish: function(data) {

      jsPsych.data.addDataToLastTrial({
        correct: data.response == vqa2.correct_response
      });
    
    }
  };

  var vqa3 = {
    // episode: 61  question type: 1.1  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/61.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <br>
    <button onclick="toggleText('stateText')">What's inside the apartment</button>
    <button onclick="toggleText('actionText')">Actions taken by Mary</button>
    <div id="stateText" style="display:none;">There is a bedroom, kitchen, bathroom, and living room. <br>
    In the bedroom, there is a coffee table and a desk. A remote control is on the coffee table. <br>
    The kitchen contains four cabinets, a fridge, a kitchen table, a stove, and a microwave. The third cabinet, from left to right, is empty. The fridge contains a dish bowl, two plates, and a bottle of wine. The fourth cabinet, from left to right, has a water glass. The stove holds a salmon, two cupcakes, and a plate. The second cabinet, from left to right, has a condiment bottle. The microwave has a cupcake. The first cabinet, from left to right, is empty. <br>
    The bathroom has a bathroom cabinet, which is empty. <br>
    The living room has a coffee table, cabinet, desk, and sofa. The coffee table has a wine glass and a book. The cabinet contains chips, an apple, a water glass, two plates, a bottle of wine, two wine glasses, a condiment bottle, and a remote control. 
    </div>
    <div id="actionText" style="display:none;">Mary is in the bathroom. She then walks to the kitchen and heads towards the stove, opening and closing it. She then moves to the second cabinet, opening and closing it, followed by the third cabinet. Mary then returns to the first cabinet, opening and closing it, before moving to the fourth cabinet and doing the same. Finally, she walks towards the fridge, ready to open it. </div>
    <br>
    <p>If Mary has been trying to get a wine, which one of the following statements is more likely to be true? <br>
    (a) Mary thinks that the wine is inside the fridge. <br>
    (b) Mary thinks that the wine is not inside the fridge.</p>
    `,
    choices: ['a', 'b'],
    correct_response: 'a',
    on_finish: function(data) {

      jsPsych.data.addDataToLastTrial({
        correct: data.response == vqa3.correct_response
      });
    
    }
  };

  var vqa4 = {
    // episode: 130  question type: 1.3  answer: b
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/130.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <br>
    <button onclick="toggleText('stateText')">What's inside the apartment</button>
    <button onclick="toggleText('actionText')">Actions taken by James</button>
    <div id="stateText" style="display:none;">There is a bedroom, kitchen, bathroom, and living room. <br>
    In the bedroom, there is a coffee table and a desk. On the coffee table, there is a wine glass, remote control, and a book. <br>
    The kitchen has four cabinets, a fridge, kitchen table, stove, and microwave. The third cabinet, from the left, contains a water glass and condiment bottle. The fridge contains two cupcakes, an apple, a bottle of wine, a plate, and a dish bowl. The fourth cabinet, from the left, contains two dish bowls and a plate. The stove contains a salmon. The second cabinet, from the left, contains a bottle of wine. The microwave contains a cupcake and a salmon. The first cabinet, from the left, contains a dish bowl. <br>
    The bathroom has a bathroom cabinet, which is empty. <br>
    The living room has a coffee table, cabinet, desk, and sofa. The cabinet is empty. 
    </div>
    <div id="actionText" style="display:none;">James is in the bathroom. He then walks to the kitchen and heads towards the fourth cabinet.</div>
    <br>
    <p>If James has been trying to get a dishbowl, which one of the following statements is more likely to be true?<br>
     (a) James thinks that the dishbowl is inside the fridge.<br>
     (b) James thinks that the dishbowl is not inside the fridge.</p>
    `,
    choices: ['a', 'b'],
    correct_response: 'b',
    on_finish: function(data) {

      jsPsych.data.addDataToLastTrial({
        correct: data.response == vqa4.correct_response
      });
    
    }
  };

  var vqa5 = {
    // episode: 130  question type: 1.1  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/130.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <br>
    <button onclick="toggleText('stateText')">What's inside the apartment</button>
    <button onclick="toggleText('actionText')">Actions taken by James</button>
    <div id="stateText" style="display:none;">There is a bedroom, kitchen, bathroom, and living room.<br> 
    In the bedroom, there is a coffee table and a desk. On the coffee table, there is a wine glass, remote control, and a book. <br>
    The kitchen has four cabinets, a fridge, kitchen table, stove, and microwave. The third cabinet, from left to right, contains a water glass and condiment bottle. The fridge holds two cupcakes, an apple, a bottle of wine, a plate, and a dish bowl. The fourth cabinet, from left to right, contains two dish bowls and a plate. The stove holds a salmon. The second cabinet, from left to right, holds a bottle of wine. The microwave holds a cupcake and a salmon. The first cabinet, from left to right, holds a dish bowl. <br>
    The bathroom has a cabinet, which is empty. <br>
    The living room has a coffee table, cabinet, desk, and sofa. The cabinet is empty. 
    </div>
    <div id="actionText" style="display:none;">James is in the bathroom. He then walks to the kitchen and heads towards the fourth cabinet, preparing to open it. </div>
    <br>
    <p>If James has been trying to get a plate, which one of the following statements is more likely to be true? <br>
    (a) James thinks that the plate is inside the 4th kitchencabinet. <br>
    (b) James thinks that the plate is not inside the 4th kitchencabinet.</p>
    `,
    choices: ['a', 'b'],
    correct_response: 'a',
    on_finish: function(data) {

      jsPsych.data.addDataToLastTrial({
        correct: data.response == vqa5.correct_response
      });
    
    }
  };

  var vqa6 = {
    // episode: 130  question type: 1.1  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/130.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <br>
    <button onclick="toggleText('stateText')">What's inside the apartment</button>
    <button onclick="toggleText('actionText')">Actions taken by James</button>
    <div id="stateText" style="display:none;">There is a bedroom, kitchen, bathroom, and living room. <br>
    In the bedroom, there is a coffee table and a desk. On the coffee table, there is a wine glass, remote control, and a book. <br>
    The kitchen has four cabinets, a fridge, kitchen table, stove, and microwave. The third cabinet, from left to right, contains a water glass and condiment bottle. The fridge holds two cupcakes, an apple, a bottle of wine, a plate, and a dish bowl. The fourth cabinet, from left to right, contains two dish bowls and a plate. The stove holds a salmon. The second cabinet, from left to right, holds a bottle of wine. The microwave holds a cupcake and a salmon. The first cabinet, from left to right, holds a dish bowl. <br>
    The bathroom has a cabinet, which is empty. <br>
    The living room has a coffee table, cabinet, desk, and sofa. The cabinet is empty. 
    </div>
    <div id="actionText" style="display:none;">James is in the bathroom. He then walks to the kitchen, goes to the fourth cabinet, opens it, closes it, and then moves towards the microwave, ready to open it.</div>
    <br>
    <p>If James has been trying to get a cupcake, which one of the following statements is more likely to be true? <br>
    (a) James thinks that the cupcake is inside the microwave. <br>
    (b) James thinks that the cupcake is not inside the microwave.</p>
    `,
    choices: ['a', 'b'],
    correct_response: 'a',
    on_finish: function(data) {

      jsPsych.data.addDataToLastTrial({
        correct: data.response == vqa6.correct_response
      });
    
    }
  };

  var vqa7 = {
    // episode: 131  question type: 1.1  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/131.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <br>
    <button onclick="toggleText('stateText')">What's inside the apartment</button>
    <button onclick="toggleText('actionText')">Actions taken by James</button>
    <div id="stateText" style="display:none;">There is a bedroom, kitchen, bathroom, and living room. <br>
    In the bedroom, there is a coffee table and a desk. A wine glass is on the coffee table. <br>
    The kitchen contains four cabinets, a fridge, a kitchen table, a stove, and a microwave. The third cabinet, from left to right, is empty. The fridge contains an apple and a cupcake. An apple is in the fourth cabinet, from left to right. Three cupcakes and a salmon are in the stove. The second cabinet, from left to right, contains two dish bowls, two plates, and a water glass. A condiment bottle is in the microwave. The first cabinet, from left to right, has a chip and a water glass. <br>
    The bathroom has a bathroom cabinet, which is empty. <br>
    The living room has a coffee table, a cabinet, a desk, and a sofa. A wine glass is on the coffee table. The cabinet contains a bottle of wine, two books, a water glass, an apple, a chip, and a condiment bottle.</div>
    <div id="actionText" style="display:none;">James is in the bathroom. He then walks to the kitchen and heads towards the refrigerator, preparing to open it.</div>
    <br>
    <p>If James has been trying to get a apple, which one of the following statements is more likely to be true? <br>
    (a) James thinks that the apple is inside the fridge. <br>
    (b) James thinks that the apple is not inside the fridge.</p>
    `,
    choices: ['a', 'b'],
    correct_response: 'a',
    on_finish: function(data) {

      jsPsych.data.addDataToLastTrial({
        correct: data.response == vqa7.correct_response
      });
    
    }
  };

  var vqa8 = {
    // episode: 131  question type: 1.3  answer: b
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/131.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <br>
    <button onclick="toggleText('stateText')">What's inside the apartment</button>
    <button onclick="toggleText('actionText')">Actions taken by James</button>
    <div id="stateText" style="display:none;">There is a bedroom, kitchen, bathroom, and living room. <br>
    In the bedroom, there is a coffee table and a desk. A wine glass is on the coffee table. <br>
    The kitchen contains four cabinets, a fridge, a kitchen table, a stove, and a microwave. The third cabinet, from left to right, is empty. The fridge contains an apple and a cupcake. An apple is in the fourth cabinet, from left to right. Three cupcakes and a salmon are in the stove. The second cabinet, from left to right, contains two dish bowls, two plates, and a water glass. A condiment bottle is in the microwave. The first cabinet, from left to right, holds a bag of chips and a water glass. <br>
    The bathroom has a cabinet, which is empty. <br>
    The living room has a coffee table, a cabinet, a desk, and a sofa. A wine glass is on the coffee table. The cabinet contains a bottle of wine, two books, a water glass, an apple, a bag of chips, and a condiment bottle.</div>
    <div id="actionText" style="display:none;">James is in the bathroom. He then walks to the kitchen and goes to the refrigerator, opens it, and then closes it. </div>
    <br>
    <p>If James has been trying to get a condimentbottle, which one of the following statements is more likely to be true? <br>
    (a) James thinks that the condimentbottle is inside the microwave. <br>
    (b) James thinks that the condimentbottle is not inside the microwave.</p>
    `,
    choices: ['a', 'b'],
    correct_response: 'b',
    on_finish: function(data) {

      jsPsych.data.addDataToLastTrial({
        correct: data.response == vqa8.correct_response
      });
    
    }
  };

  var vqa9 = {
    // episode: 131  question type: 1.2  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/131.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <br>
    <button onclick="toggleText('stateText')">What's inside the apartment</button>
    <button onclick="toggleText('actionText')">Actions taken by James</button>
    <div id="stateText" style="display:none;">There is a bedroom, kitchen, bathroom, and living room. <br>
    In the bedroom, there is a coffee table and a desk. A wine glass is on the coffee table. <br>
    The kitchen contains four cabinets, a fridge, a kitchen table, a stove, and a microwave. The third cabinet, from left to right, is empty. The fridge contains an apple and a cupcake. An apple is in the fourth cabinet, from left to right. The stove holds three cupcakes and a salmon. The second cabinet, from left to right, contains two dish bowls, two plates, and a water glass. The microwave has a condiment bottle. The first cabinet, from left to right, has a chip and a water glass. <br>
    The bathroom has a bathroom cabinet, which is empty. <br>
    The living room has a coffee table, cabinet, desk, and sofa. A wine glass is on the coffee table. The cabinet contains a bottle of wine, two books, a water glass, an apple, a chip, and a condiment bottle.</div>
    <div id="actionText" style="display:none;">James is in the bathroom. He then walks to the kitchen, goes to the fridge, opens it, closes it, and then moves to the second cabinet, ready to open it.</div>
    <br>
    <p>If James has been trying to get a condimentbottle, which one of the following statements is more likely to be true? <br>
    (a) James thinks that the condimentbottle is inside the 2nd kitchencabinet. <br>
    (b) James thinks that the condimentbottle is not inside the 2nd kitchencabinet.</p>
    `,
    choices: ['a', 'b'],
    correct_response: 'a',
    on_finish: function(data) {

      jsPsych.data.addDataToLastTrial({
        correct: data.response == vqa9.correct_response
      });
    
    }
  };

  var vqa10 = {
    // episode: 131  question type: 1.1  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/131.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <br>
    <button onclick="toggleText('stateText')">What's inside the apartment</button>
    <button onclick="toggleText('actionText')">Actions taken by James</button>
    <div id="stateText" style="display:none;">There is a bedroom, kitchen, bathroom, and living room. <br>
    In the bedroom, there is a coffee table and a desk. A wine glass is on the coffee table. <br>
    The kitchen contains four cabinets, a fridge, a kitchen table, a stove, and a microwave. The third cabinet, from left to right, is empty. The fridge contains an apple and a cupcake. An apple is in the fourth cabinet, from left to right. Three cupcakes and a salmon are in the stove. The second cabinet, from left to right, contains two dish bowls, two plates, and a water glass. A condiment bottle is in the microwave. The first cabinet, from left to right, holds a bag of chips and a water glass. <br>
    The bathroom has a cabinet, which is empty. <br>
    The living room has a coffee table, a cabinet, a desk, and a sofa. A wine glass is on the coffee table. The cabinet contains a bottle of wine, two books, a water glass, an apple, a bag of chips, and a condiment bottle. </div>
    <div id="actionText" style="display:none;">James is in the bathroom. He then walks to the kitchen, goes to the fridge, opens it, closes it, and then moves to the second kitchen cabinet. He opens it and closes it before walking back to the living room and approaching the cabinet.</div>
    <br>
    <p>If James has been trying to get a condimentbottle, which one of the following statements is more likely to be true? <br>
    (a) James thinks that the condimentbottle is inside the cabinet. <br>
    (b) James thinks that the condimentbottle is not inside the cabinet.</p>
    `,
    choices: ['a', 'b'],
    correct_response: 'a',
    on_finish: function(data) {

      jsPsych.data.addDataToLastTrial({
        correct: data.response == vqa10.correct_response
      });
    
    }
  };

  timeline.push(vqa1, vqa2, vqa3, vqa4, vqa5, vqa6, vqa7, vqa8, vqa9, vqa10);

  jsPsych.run(timeline).then(function() {

    const numCorrect = jsPsych.data.get().filter({correct: true}).count();
  
  });
  
  /* define debrief */
  var debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
      var accuracy = Math.round(numCorrect / 10 * 100); 

      return `<p>You responded correctly on ${numCorrect} out of 10 trials.</p>
              <p>Your accuracy is ${accuracy}%.</p>
              <p>Press any key to complete the experiment. Thank you!</p>`;
    },
    data: {type: "introduction"}
 };
 
  timeline.push(debrief_block);

  return timeline
}


  /* start the experiment */
  initializeTimeline().then(timeline => {jsPsych.run(timeline)})
