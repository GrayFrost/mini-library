<script>
  let counter = 5;
  let foo = 5;
  const increment = () => counter++;
  const decrement = () => counter--;
  const incrementFoo = () => foo++;

</script>

<button on:click={decrement}>Decrement</button>
<button on:click={increment}>Increment</button>
<button on:click={incrementFoo}>Increment Foo</button>