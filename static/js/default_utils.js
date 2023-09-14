async function makeConsent() {
    // Load the consent.html file
    const response = await fetch('/backend/fetch_consent');
    const consentContent = await response.text();
  
    // Create a jsPsych trial
    const consentTrial = {
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <h1>Consent Form</h1>
        ${consentContent}
      `,
      choices: ['I Agree'],
      data: {type: 'consent'}
    };
  
    return consentTrial;
}

async function sendToRecord(data) {
  const response = await fetch('/backend/record', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  return response
}

async function updateVersion(id, version) {
  response = sendToRecord({'SubjectID': id, 'Version': version})
  const data = await response
  if (!data.ok) {
    alert("Error updating data on the server. Please contact " + adminEmail + "\n\n" +
          "Error type: record_version_number")
  }
}

async function startIntroduction(id) {
  async function sendFnc() {
    let toSend = {'SubjectID': id, 'Status': 'on_introduction'}
    response = sendToRecord(toSend)
    const data = await response
    if (!data.ok) {
      alert("Error updating data on the server. Please contact " + adminEmail + "\n\n" +
            "Error type: startIntroduction not completed")
    }
    return data
  }
  
  let tr = {
    type: jsPsychCallFunction,
    func: sendFnc,
    data: {type: 'fnc_call'}
  }
  return tr
}

async function endIntroduction(id) {
  async function sendFnc() {
    let toSend = {'SubjectID': id, 'Status': 'on_experiment'}
    response = sendToRecord(toSend)
    const data = await response
    if (!data.ok) {
      alert("Error updating data on the server. Please contact " + adminEmail + "\n\n" +
            "Error type: startIntroduction not completed")
    }
    return data
  }
  
  let tr = {
    type: jsPsychCallFunction,
    func: sendFnc,
    data: {type: 'fnc_call'}
  }
  return tr
}

async function recordData(id, final=false) {
  let toSend = {'SubjectID': id}
  toSend['Data'] = JSON.stringify(jsPsych.data.get())
  toSend['Events'] = JSON.stringify(jsPsych.data.getInteractionData())
  if (final) {toSend['Status'] = 'finished'}
  response = sendToRecord(toSend)
  const data = await response
  if (!data.ok) {
    alert("Error updating data on the server. Please contact " + adminEmail + "\n\n" +
          "Error type: recordData not completed")
  }
  return data
}

async function recordDataInTimeline(id, final=false) {
  async function sendFnc() {
    return await recordData(id, final)
  }

  let tr = {
    type: jsPsychCallFunction,
    func: sendFnc,
    data: {type: 'fnc_call'}
  }
  return tr
}

function endExperiment(id) {
  recordDataInTimeline(id, true) // End with a record

  // Make a form for POSTing to the endurl
  const form = document.createElement('form')
  form.method = "POST"
  form.action = endurl

  const idInp = document.createElement('input')
  idInp.type = 'hidden'
  idInp.name = 'ID'
  idInp.value = id

  form.appendChild(idInp)
  document.body.appendChild(form)
  form.submit()
}
  

  
function getStaticUrl(relativePath) {
  return staticBaseUrl + relativePath
}

function getFilenameWithoutExtension(path) {
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.').slice(0, -1).join('.');
}

function translateUrls(relativePaths) {
  const urls = relativePaths.reduce((acc, path) => {
    const key = getFilenameWithoutExtension(path)
    acc[key] = getStaticUrl(path)
    return acc
  }, {})
  return urls
}