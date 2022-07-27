let fields = [];
let currentShape = 'cross';

/* This fills the array fields either withe the cross or withe the the circle.
The value will changed on click between the cross the circle through the if-statement */
function fillShape(id) {
    if (currentShape == 'cross') {
        currentShape = 'circle'
    } else {
        currentShape = 'cross'
    }

    fields[id] = currentShape;
    console.log(fields);
}