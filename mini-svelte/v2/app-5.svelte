

<script>
  let count = 0;

  const updateCount = () => {
    console.log('updateCount');
    count++;
  }

</script>

<button on:click={updateCount}></button>
{count}
hello