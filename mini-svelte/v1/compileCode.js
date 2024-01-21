
    function append(node, target) {
      target.appendChild(node);
    }
    let fragment = document.createDocumentFragment();
  
          let script1 = document.createElement("script");

        
          let t1 = document.createTextNode(`\n  let count = 0;
`);

        
          append(t1, script1);

        
          append(script1, fragment)
        
          let div1 = document.createElement("div");

        
          let t2 = document.createTextNode(`\n  `);

        
          append(t2, div1);

        
          let span1 = document.createElement("span");

        
          let t3 = document.createTextNode(`hello`);

        
          append(t3, span1);

        
          append(span1, div1)
        
          let ul1 = document.createElement("ul");

        
          let t4 = document.createTextNode(`\n    `);

        
          append(t4, ul1);

        
          let li1 = document.createElement("li");

        
          let t5 = document.createTextNode(`svelte`);

        
          append(t5, li1);

        
          append(li1, ul1)
        
          let li2 = document.createElement("li");

        
          document.createTextNode("MustacheTag");

        
          append(li2, ul1)
        
          append(ul1, div1)
        
          append(div1, fragment)
        document.body.appendChild(fragment);