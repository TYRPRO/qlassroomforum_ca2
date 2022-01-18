const noAnswersClassess = "d-flex align-items-center p-2 rounded-pill cursor-pointer user-select-none "
const AnswersClasses = noAnswersClassess + "bg-warning"

const AnswersPill = (props) => {
    const answers = props.answers;
    return(
        <div className="w-25 col-3 d-flex align-items-center">
          <div className={answers > 0 ? AnswersClasses : noAnswersClassess} onClick={()=>{console.log("action for answers click in progress")}}>
            <span className="material-icons">bookmark_border</span>
            <span className="text-center align-middle px-3">{answers} Answers</span>
          </div>
        </div>
    )
}

export default AnswersPill;