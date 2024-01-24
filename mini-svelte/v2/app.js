
      export default function() {
        let button_1;
let txt_2;
        
        function update() {}
        let count = 0;
const updateCount = () => {
    count++;
};

        var lifecircle = {
          create(target) {
            button_1 = document.createElement('button')
target.appendChild(button_1)
txt_2 = document.createTextNode('hello');
target.appendChild(txt_2)
          },
          update(changed) {
            
          },
          destroy(target) {
            target.removeChild(button_1)
target.removeChild(txt_2)
          }
        };
        return lifecircle;
      }
    