
      export default function() {
        let button_1;
let txt_2;
let ul_3;
let li_4;
let txt_5;
let li_6;
let txt_7;
let txt_8;
let txt_9;
        
        function update() {}
        let count = 0;
const updateCount = () => {
    console.log('updateCount');
    count++;
};

        var lifecircle = {
          create(target) {
            button_1 = document.createElement('button')
button_1.addEventListener('click', updateCount);
txt_2 = document.createTextNode('add count');
button_1.appendChild(txt_2)
target.appendChild(button_1)
ul_3 = document.createElement('ul')
li_4 = document.createElement('li')
txt_5 = document.createTextNode('one');
li_4.appendChild(txt_5)
ul_3.appendChild(li_4)
li_6 = document.createElement('li')
txt_7 = document.createTextNode('two');
li_6.appendChild(txt_7)
ul_3.appendChild(li_6)
target.appendChild(ul_3)
txt_8 = document.createTextNode('count:');
target.appendChild(txt_8)
txt_9 = document.createTextNode(count)
target.appendChild(txt_9);
          },
          update(changed) {
            
          },
          destroy(target) {
            button_1.removeEventListener('click', 'updateCount');
button_1.removeChild(txt_2)
target.removeChild(button_1)
li_4.removeChild(txt_5)
ul_3.removeChild(li_4)
li_6.removeChild(txt_7)
ul_3.removeChild(li_6)
target.removeChild(ul_3)
target.removeChild(txt_8)
          }
        };
        return lifecircle;
      }
    