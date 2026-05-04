const container = document.getElementById('main');
const leftPane = document.getElementById('left');
const rightPane = document.getElementById('right');
const resizer = document.getElementById('resizer-code');

const mouseDownHandler = function (_e) {
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function (e) {
    const containerRect = container.getBoundingClientRect();
    const relativeX = e.clientX - containerRect.left;
    const leftFlex = relativeX / containerRect.width;
    const rightFlex = 1 - leftFlex;

    if (leftFlex > 0.2 && rightFlex > 0.2) {
        leftPane.style.flex = leftFlex;
        rightPane.style.flex = rightFlex;
    }
};

const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
}

resizer.addEventListener('mousedown', mouseDownHandler);;
