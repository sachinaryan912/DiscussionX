let gapiLoaded = false;

const uniqueRequestId = Date.now().toString();


function loadGoogleAPI() {
  gapi.load('client:auth2', initGoogleAPI);
}

function initGoogleAPI() {
  gapi.client.init({
    apiKey: 'AIzaSyAmyoHjieQwgC3WMAgaekY9D_h8I2b3Cu8',  // Replace with your Google API key
    clientId: '183473967391-q13cq3jaccm578jlpqc6rvkb1va4v6k1.apps.googleusercontent.com',  // Replace with your Google API client ID
    discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
    scope: "https://www.googleapis.com/auth/calendar.events",
  }).then(function () {
    gapiLoaded = true;
    console.log('Google API initialized');
  }, function (error) {
    console.error('Error initializing Google API', error);
  });
}

function scheduleMeeting() {
  if (!gapiLoaded) {
    console.error('Google API not loaded');
    return;
  }

  const meetingDateTime = document.getElementById('meetingDateTime').value;

  if (meetingDateTime) {
    gapi.auth2.getAuthInstance().signIn().then(function () {
      createEvent(meetingDateTime);
    });
  } else {
    alert('Please select a date and time for the meeting.');
  }
}

function createEvent(meetingDateTime) {
  const event = {
    summary: 'Meeting',
    start: {
      dateTime: meetingDateTime,
      timeZone: 'UTC',
    },
    end: {
      dateTime: meetingDateTime,
      timeZone: 'UTC',
    },
    attendees: [],
    conferenceData: {
      createRequest: {
        requestId: uniqueRequestId,  // Replace with a unique request ID
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
  };

  gapi.client.calendar.events.insert({
    'calendarId': 'primary',
    'resource': event,
  }).then(function (response) {
    const meetLink = response.result.hangoutLink;
    window.open(meetLink, '_blank');
  }, function (error) {
    console.error('Error creating event', error);
  });
}

// Load Google API when the page is loaded
document.addEventListener('DOMContentLoaded', loadGoogleAPI);
