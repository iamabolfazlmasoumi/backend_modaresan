import AnswerSheet from '../../models/answer-sheet';

export const checkIfExistNextBooklet = (req) => {
    let uncompleted = AnswerSheet.find(a => a.exam === req.params.id && !a.isCompleted);
    if (uncompleted != null) {
        return true;
    } else {
        return false;
    }
}