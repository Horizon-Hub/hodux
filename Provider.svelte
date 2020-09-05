<script>
  import { setContext, onDestroy } from "svelte";
  import { __HODUX_CONNECT_KEY__ } from "./constants";

  export let store;
  let state;

  const unsubscribe = store.subscribe((s) => (state = s));

  setContext(__HODUX_CONNECT_KEY__, {
    state,
    ...store,
  });

  onDestroy(unsubscribe);
</script>

<slot></slot>
