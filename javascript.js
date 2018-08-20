// Initialize Firebase
var config = {
  apiKey: "",
  authDomain: "www.com",
  databaseURL: "https://www.com",
  projectId: "eatnride-dabda",
  storageBucket: "eatnride-dabda.appspot.com",
  messagingSenderId: "",
};
firebase.initializeApp(config);


//Survey results button action
document.querySelector('.survey-btn').addEventListener('click', SurveyBtnHandler);

function SurveyBtnHandler(event) {
  document.querySelector(".results-page").style.display = 'block';
  //this changes which div's are shown/hidden
  document.querySelector('.form-page').style.display = "none";
};

//Reset the page to beginning = try again!
document.querySelector('.reset-btn').addEventListener('click', ResetEventHandler);

function ResetEventHandler(event) {
  console.log("reseteventhandler btn clicked")
  document.querySelector(".results-page").style.display = 'none';
  document.querySelector(".form-page").style.display = 'block';
};


//add th commit. remove when in the lon online repo
