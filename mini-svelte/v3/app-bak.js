// 该文件由compile生成
import {
  SvelteComponent,
  detach,
  element,
  init,
  insert,
  listen,
  noop,
  safe_not_equal,
  text,
  empty,
  space
} from './runtime'

function create_if_block() {}

function create_fragment() {
  return {
    c() {},
    m() {},
    p() {},
    d() {},
  }
}

function instance() {}

class App extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal)
  }
}

export default App;



