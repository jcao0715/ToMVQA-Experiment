function toggleText(id) {
  // Hide all text sections
  document.getElementById('stateText').style.display = 'none';
  document.getElementById('actionText').style.display = 'none';
  
  // Show the specific section associated with the clicked button
  let element = document.getElementById(id);
  element.style.display = 'block';
}


function checkTime(video, time) {
  if (video.currentTime > time) {
      video.currentTime = time;
      video.pause();
  }
}

function setPositionAndPlay(time) {
  var video = document.getElementById('test');
  video.currentTime = time;
  video.play();
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
  const videos = ['/61new.mp4', 'mov/130new.mp4', 'mov/131new.mp4'];
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
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>(Please view in full screen)</p>
      <p>Welcome!</p>
      <p>In this experiment, you will watch video clips of a person trying to find an object in an apartment. At various points in the video, we will pause and ask you to answer questions about what the person is trying to find and where they think the object might be. You can watch the video clips as many times as you want. You can also watch the earlier part of the clip by hovering over the progress bar.</p>
      <b>Please note that the person may not know where things are in this apartment and may have to look for them sometimes.</b>
      <p>Thank you for your participation!</p>

      <video id="test" width="500" controls ontimeupdate="checkTime(this, 15)">
        <source src="http://visiongpu20.csail.mit.edu:9000/video1100.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>

      <button onclick="setPositionAndPlay(10)" type="button"> Start video </button>
  `,
    choices: ['Continue'],
    data: {type: 'introduction'},
  };
  timeline.push(welcome);

  /* define instructions trial */
  var instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>To help you answer questions, we will provide the following additional information: </p>
      <ul>
        <li>You can click the “What’s inside the apartment” button below to check where things are. <b>Tip: You can use Ctrl+F to search the name of an object (e.g., plate) to quickly find where it is, or search the name of a location (e.g., fridge, kitchen table) to check what objects are at that location. 
        </b></li>
        <li>You can click the “Actions taken by [name]” button to check what actions this person has taken (in case you cannot see the person clearly in the video). 
        </li>
      </ul>

      <video id="test" width="500" controls ontimeupdate="checkTime(this, 15)">
        <source src="http://visiongpu20.csail.mit.edu:9000/video1100.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>

      <button onclick="setPositionAndPlay(10)" type="button"> Start video </button>
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
    `,
    choices: ['Continue'],
    data: {type: 'introduction'}
  };
  timeline.push(instructions);

  timeline.push(await endIntroduction(id))

  /* try out trial */
  var tryout = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>After a short check to ensure that you have understood the instructions, you will have a chance to try out 1 example trial. </p>
      <p>After the example trial, you will be able to start the experiment. </p>
      `,
    choices: ['Continue'],
    data: { type: 'trial instructions' }
  };

  timeline.push(tryout);

  /* comprehension check trial */
  var comprehension1 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>What will you do in this experiment?</p>
      <p>(a) Answer questions about where an object is located in an apartment. <br>
      (b) Answer questions about what a person wants to get and where that object could be in that person's mind. <br>
      (c) Describe a person's activity after watching a video. </p>
      `,
    choices: ['a', 'b', 'c'],
    correct_response: 'b',
    data: {type: 'comprehension1'}
  };

  var comprehension2 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>If you want to know what objects are inside the microwave, what should you do?</p>
      <p>(a) Make a guess. <br>
      (b) Watch the video. <br>
      (c) Click the "What's inside the apartment" button. </p>
      `,
    choices: ['a', 'b', 'c'],
    correct_response: 'c',
    data: {type: 'comprehension2'}
  };

  var comprehension3 = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>Which one of the statements is incorrect? </p>
      <p>(a) The person in the video always knows where an object actually is. <br>
      (b) You can slide the progress bar to view previous sections of the video. <br>
      (c) When you can't see the person clearly in the video, you can click the "Actions taken by [name]" button to see what they are doing. </p>
      `,
    choices: ['a', 'b', 'c'],
    correct_response: 'a',
    data: {type: 'comprehension3'}
  };

  var showComprehensionIncorrect = false;
  /* Feedback page for incorrect comprehension answers */
  var comprehensionIncorrect = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>You didn't pass the quiz. Please read the instructions carefully again.</p>
    `,
    choices: ['Retry Comprehension Test'],
    data: { type: 'comprehension_incorrect' }
  };

  /* if all comprehension questions answered correctly */
  var comprehensionCorrect = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <p>Great! You have answered all the comprehension questions correctly. </p>
      <p>Now, you will have a chance to try out 1 example trial. </p>
      <p>After the example trial, you will be able to start the experiment. </p>
      `,
    choices: ['Continue'],
    data: { type: 'comprehension_correct' }
  };

    /* video and question trial */
    var trial1 = {
      // episode: 61  question type: 1.1  answer: a
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <video id="test" width="500" controls ontimeupdate="checkTime(this, 13)">
          <source src="http://visiongpu20.csail.mit.edu:9000/61new.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video> 
  
        <button onclick="setPositionAndPlay(0)" type="button"> Start video </button>
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
      data: {type: 'trial1'}
    };
  
    var trial2 = {
      // episode: 61  question type: 1.2  answer: a
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <video id="test" width="500" controls ontimeupdate="checkTime(this,31)">
          <source src="http://visiongpu20.csail.mit.edu:9000/61new.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
  
        <button onclick="setPositionAndPlay(13)" type="button"> Start video </button>
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
      data: {type: 'trial2'}
    };
    
    

    // var comprehensionTimeline = {
    //   timeline: [comprehension1, comprehension2, comprehension3],
    //   loop_function: function(data) {
    //     var responses = data.values();
    //     var allCorrect = true;
    
    //     if (responses[0].response != 1) {
    //         allCorrect = false;
    //     }
    //     if (responses[1].response != 2) {
    //         allCorrect = false;
    //     }
    //     if (responses[2].response != 0) {
    //         allCorrect = false;
    //     }
        
    //     return !allCorrect;  // if not all correct, loop the timeline
    //   },
    // };
    
    // timeline.push(comprehensionTimeline);  // Add comprehensionTimeline to the main timeline
    // timeline.push(comprehensionCorrect, trial1, trial2);
      
    var comprehensionTrials = {
      timeline: [comprehension1, comprehension2, comprehension3],
      data: {type: 'comprehension'}
    };
    
    var comprehensionFeedback = {
      timeline: [comprehensionIncorrect],
      conditional_function: function(){
        var lastTrialsData = jsPsych.data.get().last(3).values();

        if (lastTrialsData[0].response != 1 || lastTrialsData[1].response != 2 || lastTrialsData[2].response != 0) {
          return true; // Show the incorrect feedback if any of the answers are wrong
        } else {
          return false; // Don't show the incorrect feedback
        }
      }
    };
    
    var comprehensionSuccess = {
      timeline: [comprehensionCorrect, trial1, trial2],
      conditional_function: function(){
        var lastTrialsData = jsPsych.data.get().last(3).values();
        
        if (lastTrialsData[0].response == 1 && lastTrialsData[1].response == 2 && lastTrialsData[2].response == 0) {
          return true; // Show the success feedback if all answers are correct
        } else {
          return false; // Don't show the success feedback
        }
      }
    };

    var mainTimeline = {
      timeline: [comprehensionTrials, comprehensionFeedback, comprehensionSuccess],
      loop_function: function(data){
        var lastTrialsData = data.values(); // get the last 3 trials, which are the comprehension questions
        console.log(lastTrialsData);
        // Check if any of the answers are incorrect
        if (lastTrialsData[0].response != 1 || lastTrialsData[1].response != 2 || lastTrialsData[2].response != 0) {
          console.log('incorrect');
          return true; // Loop if any answer is incorrect
        } else {
          console.log('correct');
          return false; // Don't loop if all answers are correct
        }
      }
    };

    timeline.push(mainTimeline);
    

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


  var vqa1 = {
    // episode: 61  question type: 1.2  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video id="test" width="500" controls ontimeupdate="checkTime(this, 13)">
        <source src="http://visiongpu20.csail.mit.edu:9000/61new.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>

      <button onclick="setPositionAndPlay(0)" type="button"> Start video </button>
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
  };

  var vqa2 = {
    // episode: 61  question type: 1.2  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video id="test" width="500" controls ontimeupdate="checkTime(this,31)">
      <source src="http://visiongpu20.csail.mit.edu:9000/61new.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    <button onclick="setPositionAndPlay(13)" type="button"> Start video </button>
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
  };

  var vqa3 = {
    // episode: 61  question type: 1.1  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video id="test" width="500" controls ontimeupdate="checkTime(this, 46)">
      <source src="http://visiongpu20.csail.mit.edu:9000/61new.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <button onclick="setPositionAndPlay(31)" type="button"> Start video </button>
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
  };

  var vqa4 = {
    // episode: 130  question type: 1.3  answer: b
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/130new.mp4" type="video/mp4">
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
  };

  var vqa5 = {
    // episode: 130  question type: 1.1  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/130new.mp4" type="video/mp4">
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
  };

  var vqa6 = {
    // episode: 130  question type: 1.1  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/130new.mp4" type="video/mp4">
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
  };

  var vqa7 = {
    // episode: 131  question type: 1.1  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/131new.mp4" type="video/mp4">
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
  };

  var vqa8 = {
    // episode: 131  question type: 1.3  answer: b
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/131new.mp4" type="video/mp4">
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
  };

  var vqa9 = {
    // episode: 131  question type: 1.2  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/131new.mp4" type="video/mp4">
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
  };

  var vqa10 = {
    // episode: 131  question type: 1.1  answer: a
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <video controls>
      <source src="mov/131new.mp4" type="video/mp4">
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
  };

  timeline.push(vqa1, vqa2, vqa3, vqa4, vqa5, vqa6, vqa7, vqa8, vqa9, vqa10);

  /* finish */
  var finish = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
    <p>You have completed the experiment. Please complete a short questionnaire.</p>
    `,
    choices: ['Continue'],
    data: {type: 'finish'}
  };
  timeline.push(finish);

  /* post questionnaire */
  var post_questionnaire = {
    type: jsPsychSurveyText,
    questions: [{prompt: "Gender", required: false},
                {prompt: "Age", required: false},
                {prompt: "What information did you use to answer the questions (video, what’s inside the apartment, actions taken by [name])?", required: false},
                {prompt: "How did you answer the questions based on the information?", required: false},
                {prompt: "Are there any other comments you would like to provide?", required: false},
                {prompt: "Would you be willing to be invited back for a longer version of the experiment?", required: false}],
    data: {type: 'post_questionnaire'}
  };
  timeline.push(post_questionnaire);
  
  /* define debrief */
  var debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {

      return `<p>Press any key to complete the experiment. Thank you!</p>`;
    },
    data: {type: "introduction"}
 };
 
  timeline.push(debrief_block);

  return timeline
}


  /* start the experiment */
  initializeTimeline().then(timeline => {jsPsych.run(timeline)})
