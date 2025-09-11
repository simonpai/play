export async function animate(element, name, { classes = [], ...options } = {}) {
  element.classList.add('animate__animated');
  for (const className of classes) {
    element.classList.add(`animate__${className}`);
  }
  element.classList.add(`animate__${name}`);
  await waitForAnimation(element, options);
  element.classList.remove(`animate__${name}`);
  for (const className of classes) {
    element.classList.remove(`animate__${className}`);
  }
  element.classList.remove('animate__animated');
}

export async function waitForAnimation(element, { rejectOnCancel = false } = {}) {
  return new Promise((resolve, reject) => {
    element.addEventListener('animationend', resolve);
    element.addEventListener('animationcancel', rejectOnCancel ? reject : resolve);
  });
}

export async function show(element, ...animation) {
  element.classList.remove('hidden');
  if (animation.length) {
    await animate(element, ...animation);
  }
}

export async function hide(element, ...animation) {
  if (animation.length) {
    await animate(element, ...animation);
  }
  element.classList.add('hidden');
}
