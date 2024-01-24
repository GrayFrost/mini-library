

<script>
  let count = 0;

  const updateCount = () => {
    console.log('updateCount');
    count++;
  }

</script>

<button on:click={updateCount}>add count</button>
<ul>
  <li>one</li>
  <li>two</li>
</ul>

hello