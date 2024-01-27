

<script>
  let count = 0;

  const addCount = () => {
    count++;
  }
  const subCount = () => {
    count--;
  }

</script>

<button on:click={addCount}>count++</button>
<button on:click={subCount}>count--</button>
{#if count > 0 && count < 5}
  <div>显示</div>
{/if}
<ul>
  <li>one</li>
  <li>two</li>
</ul>
count:{count}
