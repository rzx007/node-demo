let count = 0;
const button = document.querySelector('button');
console.log(button);
const input = document.getElementById('output');
button.addEventListener('click', function () {
  
   count++;
   input.innerText = count;
});