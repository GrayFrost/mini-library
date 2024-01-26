

<script>
  let count = 0;

  const updateCount = () => {
    console.log('updateCount');
    count++;
  }

</script>

<button on:click={updateCount}>add count</button>
{#if count > 0 && count < 5}
  <span>显示</span>
{/if}
<ul>
  <li>one</li>
  <li>two</li>
</ul>
count:{count}
