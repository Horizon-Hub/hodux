<svelte:options immutable={true}/>

<script>
  import { getContext } from "svelte";
  import { __HODUX_CONNECT_KEY__, __RANDOM_MULTIPLIER__ } from "./constants";
  import { hoduxInternal } from "./internal"
  
  export let mapStateToProps = null;
  export let mapDispatchToProps = () => null;
  let ctx, state, mappedState;


  $: if(mapStateToProps) {
    Math.floor(Math.random($hoduxInternal * __RANDOM_MULTIPLIER__))
    ctx = getContext(__HODUX_CONNECT_KEY__)
    state = ctx.getState();
    mappedState = mapStateToProps(state);
  }

  const dispatch = (action) => {
    ctx.dispatch(action);
    hoduxInternal.increment()
  }
  
</script>

<slot state={mapStateToProps ? mappedState : {}} dispatch={mapDispatchToProps(dispatch)} />
