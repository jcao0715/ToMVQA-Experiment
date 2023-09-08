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

  /* preload images */
  const imgs = ['img/blue.png', 'img/orange.png']
  const imgurls = translateUrls(imgs)
  var preload = {
    type: jsPsychPreload,
    images: Object.values(imgurls),
    data: {type: 'fnc_call'}
  };
  timeline.push(preload);

  /* Load the consent form */
  timeline.push(await makeConsent())

  timeline.push(await startIntroduction(id))

  /* Do welcome and introduction here */

  timeline.push(await endIntroduction(id))
  timeline.push(await recordDataInTimeline(id))

  /* Add experiment timeline things here */

  return timeline
}


  /* start the experiment */
  initializeTimeline().then(timeline => {jsPsych.run(timeline)})
