

const ls = {
  get(i) {
    return JSON.parse(localStorage.getItem(i))
  },
  set(i, e) {
    localStorage.setItem(i, JSON.stringify(e))
    return;
  },
  del(i) {
    localStorage.removeItem(i);
  }
}

const ss = {
  get(i) {
    return JSON.parse(sessionStorage.getItem(i))
  },
  set(i, e) {
    sessionStorage.setItem(i, JSON.stringify(e))
    return;
  },
  del(i) {
    sessionStorage.removeItem(i);
  }
}

export { ls,ss }
