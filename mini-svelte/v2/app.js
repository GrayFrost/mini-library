
      export default function() {
        let button_1;
let txt_2;
let if_block_3;
let span_4;
let txt_5;
let ul_6;
let li_7;
let txt_8;
let li_9;
let txt_10;
let txt_11;
let txt_12;
        
        let collectChanges = [];
        let updateCalled = false;
        function update(changed) {
          changed.forEach(c => collectChanges.push(c));

          if (updateCalled) return;
          updateCalled = true;

          if (typeof lifecycle !== 'undefined') {
            lifecycle.update(collectChanges);
          }
          collectChanges = [];
          updateCalled = false;
        }
        let count = 0;
const updateCount = () => {
    console.log('updateCount');
    count++, update(['count']);
};

        var lifecycle = {
          create(target) {
            button_1 = document.createElement('button')
button_1.addEventListener('click', updateCount);
txt_2 = document.createTextNode('add count');
button_1.appendChild(txt_2)
target.appendChild(button_1)
function if_block_3_func() {
if_block_3 = document.createDocumentFragment()
if (count > 0 && count < 5) {
span_4 = document.createElement('span')
txt_5 = document.createTextNode('显示');
span_4.appendChild(txt_5)
if_block_3.appendChild(span_4)
target.appendChild(if_block_3)
} else {
console.log("remove todo")
}}
window.if_block_3_func = if_block_3_func;
        if_block_3_func()
ul_6 = document.createElement('ul')
li_7 = document.createElement('li')
txt_8 = document.createTextNode('one');
li_7.appendChild(txt_8)
ul_6.appendChild(li_7)
li_9 = document.createElement('li')
txt_10 = document.createTextNode('two');
li_9.appendChild(txt_10)
ul_6.appendChild(li_9)
target.appendChild(ul_6)
txt_11 = document.createTextNode('count:');
target.appendChild(txt_11)
txt_12 = document.createTextNode(count)
target.appendChild(txt_12);
          },
          update(changed) {
            window.if_block_3_func()
if (changed.includes('count')) {
            txt_12.data = count;
          }
          },
          destroy(target) {
            button_1.removeEventListener('click', 'updateCount');
button_1.removeChild(txt_2)
target.removeChild(button_1)
span_4.removeChild(txt_5)
if_block_3.removeChild(span_4)
target.removeChild(if_block_3)
li_7.removeChild(txt_8)
ul_6.removeChild(li_7)
li_9.removeChild(txt_10)
ul_6.removeChild(li_9)
target.removeChild(ul_6)
target.removeChild(txt_11)
          }
        };
        return lifecycle;
      }
    