
      export default function() {
        function update() {}
        let count = 0;
const updateCount = () => {
    count++;
};

        var lifecircle = {
          create(target) {
            button_1 = document.createElement('button')
target.appendChild(button_1)
          },
          update(changed) {
            
          },
          destroy(target) {
            target.removeChild(button_1)
          }
        };
        return lifecircle;
      }
    