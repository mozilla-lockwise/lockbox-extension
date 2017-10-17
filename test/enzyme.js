import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({adapter: new Adapter()});

const MOUNT_INJECT_ID = "mount-inject-node";

export function getInjectNode({id = MOUNT_INJECT_ID, style = ""} = {}) {
  let inject = document.getElementById(id);
  if (inject) {
    return inject;
  }

  inject = document.createElement("div");
  inject.id = id;
  inject.style = style;
  document.body.appendChild(inject);
  return inject;
}

export function mountIntoDOM(node, options = {}) {
  const inject = getInjectNode();
  return mount(node, { attachTo: inject, ...options });
}

// XXX: Export everything from enzyme.
export { mount };
export default Enzyme;
