import { noop } from "./utils";

export class SvelteComponent {
  $$ = undefined;
}

export function mount_component(component, target, anchor) {
  const { fragment } = component.$$;
  fragment && fragment.m(target, anchor);
}

export function init(
  component, // componnet实例
  options,
  instance, // 数据更新
  create_fragment,
  not_equal
) {
  const $$ = (component.$$ = {
    fragment: null,
    ctx: [], // 变量
    update: noop,
  });

  let ready = false;
  $$.ctx = instance
    ? instance(component, (i, ret, ...rest) => {
        const value = rest.length ? rest[0] : ret;
        if (not_equal($$.ctx[i], ($$.ctx[i] = value))) {
          make_dirty(component, i);
        }
        return [];
      })
    : [];
  $$.update();
  ready = true;

  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
  if (options.target) {
    // 挂载容器节点
    $$.fragment && $$.fragment.c();
    mount_component(component, options.target, options.anchor || document.querySelector('body'))
  }
}
