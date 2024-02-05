function element(name) {
  return document.createElement(name);
}

function text(data) {
  return document.createTextNode(data);
}

function append(target, node) {
  target.appendChild(node);
}

function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

export function listen(node, event, handler) {
  node.addEventListener(event, handler);
  return () => node.removeEventListener(event, handler);
}

export default function () {
  let button_1;
  let click_2;
  let txt_3;
  let button_4;
  let click_5;
  let txt_6;
  let if_block_7;
  let if_block_7_func;
  let if_block_7_func_call;
  let div_8;
  let txt_9;
  let ul_10;
  let li_11;
  let txt_12;
  let li_13;
  let txt_14;
  let txt_15;
  let txt_16;

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
      button_1 = element("button");
      click_2 = listen(button_1, "click", addCount);
      txt_3 = text("count++");
      append(button_1, txt_3);
      append(target, button_1);
      button_4 = element("button");
      click_5 = listen(button_4, "click", subCount);
      txt_6 = text("count--");
      append(button_4, txt_6);
      append(target, button_4);
      if_block_7_func = () => {
        if (count > 0 && count < 5) {
          if (if_block_7_func_call) {
            return;
          }

          if_block_7 = element("span");

          div_8 = element("div");
          txt_9 = text("显示");
          append(div_8, txt_9);
          append(if_block_7, div_8);
          append(target, if_block_7);

          if_block_7_func_call = true;
        } else {
          if_block_7_func_call = false;

          if (if_block_7) {
            detach(if_block_7);
          }
        }
      };
      if_block_7_func();
      ul_10 = element("ul");
      li_11 = element("li");
      txt_12 = text("one");
      append(li_11, txt_12);
      append(ul_10, li_11);
      li_13 = element("li");
      txt_14 = text("two");
      append(li_13, txt_14);
      append(ul_10, li_13);
      append(target, ul_10);
      txt_15 = text("count:");
      append(target, txt_15);
      txt_16 = text(count);
      append(target, txt_16);
    },
    update(changed) {
      if_block_7_func();
      if (changed.includes("count")) {
        txt_16.data = count;
      }
    },
    destroy(target) {
      click_2();
      detach(txt_3);
      detach(button_1);
      click_5();
      detach(txt_6);
      detach(button_4);
      detach(txt_9);
      detach(div_8);
      detach(if_block_7);
      detach(txt_12);
      detach(li_11);
      detach(txt_14);
      detach(li_13);
      detach(ul_10);
      detach(txt_15);
    },
  };
  return lifecycle;
}
