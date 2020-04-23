
var gameAreaDOM=document.querySelector(".gamearea")
var scorerowDOM=document.querySelector(".scorerow")
var gameoverrowDOM=document.querySelector(".gameoverrow")
var score=0;
var click=new Audio("./assets/click.wav")
let correct=0;
let total=0;



function init(){

    console.log('initFx fired')
    // var breeds=['terrier-border','terrier-dandie']
    fetch(`https://dog.ceo/api/breeds/image/random`)
    .then(res=>res.json())
    .then(res=>{
        console.log(res)
        var startDiv=document.createElement("div");
        startDiv.className="startDiv"
        var img=document.createElement("img");
        img.setAttribute("src",res.message)
        img.className='startImg'
        
        var h3=document.createElement("h3");
        h3.appendChild(document.createTextNode("Test ya Smahts!"))
        var startBtn=document.createElement("button");
        startBtn.appendChild(document.createTextNode("Play"))
        startBtn.className='startBtn'
        startBtn.onclick=choicePanel
        
        startDiv.appendChild(img)
        startDiv.appendChild(h3)
        startDiv.appendChild(startBtn)
        gameAreaDOM.appendChild(startDiv)

     
      
    })
}


window.onload=()=>{
    init()
}


function clearStats(){
    correct=0;
    total=0;
    score=0;
}



function choicePanel(){
    clearStats()
    gameoverrowDOM.innerHTML=""

    click.play()
    //clear game area
    gameAreaDOM.innerHTML=""

    var categoryHTML
    fetchCategories((categories)=>{
        categories.forEach(c=>{
             categoryHTML += `<option data-name=${c.name} value=${c.id}>${c.name}</option>`
        })
        // var startBtn=document.createElement("button");
        // startBtn.onclick=startGame;
        // startBtn.className="startGameBtn"
    

    var html=`
    <div class='gameOptionsPanel'>
    <label for="category">Category</label>
    <select id="category"
            name="category">
    ${categoryHTML}
    </select>
    <label for="length">Length</label>
    <input id='length' type='number' name="length" min='5' max='20' step='1' value='5' placeholder="# of questions..." autocomplete="off">
    <button class='startGameBtn'>Play</button>
    </div>`

    gameAreaDOM.innerHTML=html;

    document.querySelector('.startGameBtn').onclick=startGame;

  
    })




}



function fetchCategories(cb){
    fetch(`https://opentdb.com/api_category.php`)
    .then(res=>res.json())
    .then(res=>{
    console.log(res.trivia_categories)
    cb(res.trivia_categories)
    })
}










function startGame(){
    var params={
        category:document.querySelector("#category").value,
        length:document.querySelector("#length").value
    }

    console.log(params)
    total=params.length;
    gameAreaDOM.innerHTML=""

    fetchQuiz(params)

}





function fetchQuiz({category,length}){
     fetch(`https://opentdb.com/api.php?amount=${length}&category=${category}`)
    .then(res=>res.json())
    .then(res=>{
           printQuiz(res.results)
        
            var item=res.results[0]
            var {category} = item
            createScoreRow({category,length})
    })
}



function createScoreRow({category,length}){
    var html=`
    <div class='inforow'>
    <h3 style="width:70%">Category:${category}</h3>
    <div class='infopanel'>
    <h4>Length:<span class='lengthDOM'>${length}</h4>
    <h4>Score:<span class='scoreDOM'>${score}</h4>
    </div>
    </div>`

    scorerowDOM.innerHTML=html;
}



function printQuiz(quiz){
    gameAreaDOM.style.display="grid";
    gameAreaDOM.style.gridTemplateColumns=`repeat(1,1fr)`
    gameAreaDOM.style.gap="5px"
    quiz.forEach((q,idx)=>{
        printQuestion(q,idx)
    })
}



function printQuestion(question,idx){
    
    // create answers
    var answers=[question.correct_answer, ...question.incorrect_answers];
    answers.sort(()=>Math.random()-.5);

   checkLongAnswers(answers)

    //create gameCard -- store answer as prop
    var cardDiv=document.createElement("div");
    cardDiv.className="cardDiv"
    cardDiv.setAttribute("data-answer",decode(question.correct_answer))
    cardDiv.setAttribute("data-idx",idx)
    
    // create question
    var questionh5=document.createElement("h5");
    questionh5.appendChild(document.createTextNode(decode(question.question)))

    //create answerlist
    var ulAnswers=document.createElement("ul");
    ulAnswers.className='answer-list';

    answers.forEach(a=>{
        //create answer item with click fx
        var li=document.createElement("li");
        li.className='answer-item'
        li.onclick=chooseAnswer;
        li.appendChild(document.createTextNode(decode(a)))
        ulAnswers.appendChild(li)
    })

    cardDiv.appendChild(questionh5)
    cardDiv.appendChild(ulAnswers)
    gameAreaDOM.appendChild(cardDiv)
}





function chooseAnswer(e){
    var length=document.querySelector(".lengthDOM").textContent;
    //console.log(length)
    length=+length;
    length--
    document.querySelector(".lengthDOM").innerHTML=length
    click.play()
   // console.log("chooseAnswerFx fired")

    var correctAnswer=e.target.parentElement.parentElement.getAttribute("data-answer")
    var idx=e.target.parentElement.parentElement.getAttribute('data-idx')
    var playerAnswer=e.target.textContent;
  //  console.log(`Answer:${correctAnswer}, Player:${playerAnswer}`)
    var cards=document.querySelectorAll('.cardDiv')
    cards[idx].style.transform=`rotateY(180deg)`

    cards[idx].innerHTML=""
    var h3=document.createElement("h3");
    h3.className='answerh3'
    if(correctAnswer == playerAnswer){
        h3.classList.add('right')
        score+=100;
        correct++
        document.querySelector(".scoreDOM").innerHTML=score
    }
    else{
        h3.classList.add('wrong')
    }
    if(correctAnswer.length > 40){
        h3.style.fontSize='15px'
    }
    h3.appendChild(document.createTextNode(correctAnswer))
    cards[idx].appendChild(h3)

  
    //.innerHTML=correctAnswer
    if(length == 0){
        console.log("GAME OVER!!")
        setTimeout(gameOver,1000);
    }
}





//cleanup function

function decode(str){
    let textarea=document.createElement('textarea');
    textarea.innerHTML=str;

    return textarea.textContent;
}


function gameOver(){
    let highScore=JSON.parse(localStorage.getItem('score'))
 
    console.log("TestTotal: " + total + " Correct: " + correct)
    gameAreaDOM.innerHTML=""
     
    let html=""
//     if(highScore == null){
//         console.log("hit the null condition!")
//     }
//     if(highScore != null){
//     if(score > highScore.score){
//         html += '<h3>Congrats, new high score!!</h3>'
//     }
// }
     // <h2>HighScore:${highScore ? highScore.score : 0}</h2>

     html += `<div class='gameOverDiv'>
        <h1>GAME OVER!! </h1>
        <h2>Score:${score}</h2>

            <button onclick=restart() class='replayBtn'>Play Again!</button>
            </div>`

          

    gameAreaDOM.innerHTML=html;
    gameoverrowDOM.innerHTML=`<div style="display:flex;align-items:center;justify-content:space-evenly;background:rgb(0,255,0,0.2)"<h1>Game Over</h1><div><h3>Score:${score}</h3><button onclick=restart() class='replayBtn'>Play Again!</button></div>`


    setHighScore(score)
}


function setHighScore(score){
    let highScore=JSON.parse(localStorage.getItem("score")) || 0;
    console.log(highScore)
    console.log('SCORE ' + score)
    if(highScore == 0 || +score > highScore.score){
      
        localStorage.setItem('score',JSON.stringify({score}))
        console.log("high score set")
        return;
    }
    console.log("No new high score!")
    return;
  
}


function restart(){
    console.log("restart fired!")
   choicePanel()
}


function checkLongAnswers(answers){
    var total=0
    answers.forEach(answer=>{
        total += answer.length
    })

    console.log("AnswerTotal: " + total)

    
  
}