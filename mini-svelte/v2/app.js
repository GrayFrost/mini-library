export default function () {
  let button_1;
  let txt_2;
  let button_3;
  let txt_4;
  let if_block_5;
  let if_block_5_func;
  let if_block_5_func_call;
  let div_6;
  let txt_7;
  let ul_8;
  let li_9;
  let txt_10;
  let li_11;
  let txt_12;
  let txt_13;
  let txt_14;

  let collectChanges = [];
  let updateCalled = false;
  function update(changed) {
    changed.forEach((c) => collectChanges.push(c));

    if (updateCalled) return;
    updateCalled = true;

    if (typeof lifecycle !== "undefined") {
      lifecycle.update(collectChanges);
    }
    collectChanges = [];
    updateCalled = false;
  }
  let count = 0;
  const addCount = () => {
    count++, update(["count"]);
  };
  const subCount = () => {
    count--, update(["count"]);
  };

  var lifecycle = {
    create(target) {
      button_1 = document.createElement("button");
      button_1.addEventListener("click", addCount);
      txt_2 = document.createTextNode("count++");
      button_1.appendChild(txt_2);
      target.appendChild(button_1);
      button_3 = document.createElement("button");
      button_3.addEventListener("click", subCount);
      txt_4 = document.createTextNode("count--");
      button_3.appendChild(txt_4);
      target.appendChild(button_3);
      if_block_5_func = () => {
        if (count > 0 && count < 5) {
          if (if_block_5_func_call) {
            return;
          }

          if_block_5 = document.createElement("span");

          div_6 = document.createElement("div");
          txt_7 = document.createTextNode("显示");
          div_6.appendChild(txt_7);
          if_block_5.appendChild(div_6);
          target.appendChild(if_block_5);

          if_block_5_func_call = true;
        } else {
          if_block_5_func_call = false;

          if (if_block_5 && if_block_5.parentNode) {
            if_block_5.parentNode.removeChild(if_block_5);
          }
        }
      };
      if_block_5_func();
      ul_8 = document.createElement("ul");
      li_9 = document.createElement("li");
      txt_10 = document.createTextNode("one");
      li_9.appendChild(txt_10);
      ul_8.appendChild(li_9);
      li_11 = document.createElement("li");
      txt_12 = document.createTextNode("two");
      li_11.appendChild(txt_12);
      ul_8.appendChild(li_11);
      target.appendChild(ul_8);
      txt_13 = document.createTextNode("count:");
      target.appendChild(txt_13);
      txt_14 = document.createTextNode(count);
      target.appendChild(txt_14);
    },
    update(changed) {
      if_block_5_func();
      if (changed.includes("count")) {
        txt_14.data = count;
      }
    },
    destroy(target) {
      button_1.removeEventListener("click", "addCount");
      button_1.removeChild(txt_2);
      target.removeChild(button_1);
      button_3.removeEventListener("click", "subCount");
      button_3.removeChild(txt_4);
      target.removeChild(button_3);
      div_6.removeChild(txt_7);
      if_block_5.removeChild(div_6);
      target.removeChild(if_block_5);
      li_9.removeChild(txt_10);
      ul_8.removeChild(li_9);
      li_11.removeChild(txt_12);
      ul_8.removeChild(li_11);
      target.removeChild(ul_8);
      target.removeChild(txt_13);
    },
  };
  return lifecycle;
}
