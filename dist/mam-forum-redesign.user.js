// ==UserScript==
// @name        mam-forum-redesign
// @namespace   https://github.com/nullgato
// @description This is a userscript.
// @match       https://www.myanonamouse.net/f*
// @run-at      document-start
// @version     process.env.VERSION
// @author      nullgato
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_addStyle
// ==/UserScript==

(async () => {
(function () {
'use strict';

/**
 * @remarks 
 * Sourced from afTimer by GardenShade
 * @see {@link https://github.com/gardenshade/mam-plus/blob/master/src/util.ts#L11}
 * 
 * @returns A resolution upon receiving the next frame
 */
const waitOneFrame = () => {
  return new Promise(resolve => {
    requestAnimationFrame(resolve);
  });
};

/**
 * @remarks 
 * Based on waitForElem by GardenShade
 * @see {@link https://github.com/gardenshade/mam-plus/blob/master/src/check.ts#L14}
 * 
 * @param selector The css selector to query and wait for if not yet loaded
 * @returns The element upon query/load or null if wait is unsuccessful
 */
const waitForElem = async selector => {
  const intervalLimit = 200;
  let elem;
  for (let intervalCount = 0; intervalCount < intervalLimit; intervalCount++) {
    elem = document.querySelector(selector);
    if (elem !== null) break;
    await waitOneFrame();
  }
  return elem;
};

/**
 * Attempts to inject style.css into the <head> element
 * @returns True upon successful injection, false upon failure
 */
const injectStyle = async css => {
  try {
    const elem = await waitForElem('head');
    if (elem === null) {
      console.warn('<head> element did not properly load in time');
      return false;
    }
    const globalStyleElement = GM_addStyle(css);
    elem.appendChild(globalStyleElement);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

let runEffects = runQueue;
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Owner = null;
let Transition = null;
let ExternalSourceConfig = null;
let Listener = null;
let Updates = null;
let Effects = null;
let ExecCount = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener,
    owner = Owner,
    unowned = fn.length === 0,
    current = detachedOwner === undefined ? owner : detachedOwner,
    root = unowned
      ? UNOWNED
      : {
          owned: null,
          cleanups: null,
          context: current ? current.context : null,
          owner: current
        },
    updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
  Owner = root;
  Listener = null;
  try {
    return runUpdates(updateFn, true);
  } finally {
    Listener = listener;
    Owner = owner;
  }
}
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function untrack(fn) {
  if (Listener === null) return fn();
  const listener = Listener;
  Listener = null;
  try {
    if (ExternalSourceConfig) ;
    return fn();
  } finally {
    Listener = listener;
  }
}
function writeSignal(node, value, isComp) {
  let current =
    node.value;
  if (!node.comparator || !node.comparator(current, value)) {
    node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          const TransitionRunning = Transition && Transition.running;
          if (TransitionRunning && Transition.disposed.has(o)) ;
          if (TransitionRunning ? !o.tState : !o.state) {
            if (o.pure) Updates.push(o);
            else Effects.push(o);
            if (o.observers) markDownstream(o);
          }
          if (!TransitionRunning) o.state = STALE;
        }
        if (Updates.length > 10e5) {
          Updates = [];
          if (false);
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const time = ExecCount;
  runComputation(
    node,
    node.value,
    time
  );
}
function runComputation(node, value, time) {
  let nextValue;
  const owner = Owner,
    listener = Listener;
  Listener = Owner = node;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    if (node.pure) {
      {
        node.state = STALE;
        node.owned && node.owned.forEach(cleanNode);
        node.owned = null;
      }
    }
    node.updatedAt = time + 1;
    return handleError(err);
  } finally {
    Listener = listener;
    Owner = owner;
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.updatedAt != null && "observers" in node) {
      writeSignal(node, nextValue);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c = {
    fn,
    state: state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: Owner ? Owner.context : null,
    pure
  };
  if (Owner === null);
  else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];
      else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  if ((node.state) === 0) return;
  if ((node.state) === PENDING) return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (node.state) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if ((node.state) === STALE) {
      updateComputation(node);
    } else if ((node.state) === PENDING) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;
  else Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!wait) Effects = null;
    Updates = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  const e = Effects;
  Effects = null;
  if (e.length) runUpdates(() => runEffects(e), false);
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function lookUpstream(node, ignore) {
  node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      const state = source.state;
      if (state === STALE) {
        if (source !== ignore && (!source.updatedAt || source.updatedAt < ExecCount))
          runTop(source);
      } else if (state === PENDING) lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state) {
      o.state = PENDING;
      if (o.pure) Updates.push(o);
      else Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(),
        index = node.sourceSlots.pop(),
        obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(),
          s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.owned) {
    for (i = node.owned.length - 1; i >= 0; i--) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = node.cleanups.length - 1; i >= 0; i--) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
}
function castError(err) {
  if (err instanceof Error) return err;
  return new Error(typeof err === "string" ? err : "Unknown error", {
    cause: err
  });
}
function handleError(err, owner = Owner) {
  const error = castError(err);
  throw error;
}
function createComponent(Comp, props) {
  return untrack(() => Comp(props || {}));
}

function reconcileArrays(parentNode, a, b) {
  let bLength = b.length,
    aEnd = a.length,
    bEnd = bLength,
    aStart = 0,
    bStart = 0,
    after = a[aEnd - 1].nextSibling,
    map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? (bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart]) : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart,
            sequence = 1,
            t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}
function render(code, element, init, options = {}) {
  let disposer;
  createRoot(dispose => {
    disposer = dispose;
    element === document
      ? code()
      : insert(element, code(), element.firstChild ? null : undefined, init);
  }, options.owner);
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template(html, isCE, isSVG) {
  let node;
  const create = () => {
    const t = document.createElement("template");
    t.innerHTML = html;
    return isSVG ? t.content.firstChild.firstChild : t.content.firstChild;
  };
  const fn = isCE
    ? () => untrack(() => document.importNode(node || (node = create()), true))
    : () => (node || (node = create())).cloneNode(true);
  fn.cloneNode = fn;
  return fn;
}
function setAttribute(node, name, value) {
  if (value == null) node.removeAttribute(name);
  else node.setAttribute(name, value);
}
function style(node, value, prev) {
  if (!value) return prev ? setAttribute(node, "style") : value;
  const nodeStyle = node.style;
  if (typeof value === "string") return (nodeStyle.cssText = value);
  typeof prev === "string" && (nodeStyle.cssText = prev = undefined);
  prev || (prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function insert(parent, accessor, marker, initial) {
  if (marker !== undefined && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value,
    multi = marker !== undefined;
  parent = (multi && current[0] && current[0].parentNode) || parent;
  if (t === "string" || t === "number") {
    if (t === "number") value = value.toString();
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data !== value && (node.data = value);
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray(array, value, current, unwrapArray)) {
      createRenderEffect(() => (current = insertExpression(parent, array, current, marker, true)));
      return () => current;
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value.nodeType) {
    if (Array.isArray(current)) {
      if (multi) return (current = cleanChildren(parent, current, marker, value));
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i],
      prev = current && current[normalized.length],
      t;
    if (item == null || item === true || item === false);
    else if ((t = typeof item) === "object" && item.nodeType) {
      normalized.push(item);
    } else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if (t === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic =
          normalizeIncomingArray(
            normalized,
            Array.isArray(item) ? item : [item],
            Array.isArray(prev) ? prev : [prev]
          ) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) normalized.push(prev);
      else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker = null) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === undefined) return (parent.textContent = "");
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i)
          isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
        else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}

var ForumViews = /*#__PURE__*/function (ForumViews) {
  ForumViews[ForumViews["FORUM"] = 0] = "FORUM";
  ForumViews[ForumViews["BOARD"] = 1] = "BOARD";
  ForumViews[ForumViews["THREAD"] = 2] = "THREAD";
  return ForumViews;
}(ForumViews || {});

const parseSubforums = elem => {
  if (elem === null) return [];
  const subforums = [];
  for (let subElem of elem.children) {
    if (!(subElem instanceof HTMLAnchorElement)) continue;
    subforums.push({
      href: subElem.getAttribute('href'),
      isNew: subElem.children.length > 0,
      name: subElem.textContent
    });
  }
  return subforums;
};
const parseLatestPost = cell => {
  const authorAnchorSelector = 'a[href^="/u/"]';
  const postAnchorSelector = 'a[href^="/f/t/"]';
  const authorElem = cell.querySelector(authorAnchorSelector);
  const postElem = cell.querySelector(postAnchorSelector);
  const author = {
    color: authorElem.children[0].getAttribute('style').replace('color:', ''),
    href: authorElem.getAttribute('href'),
    name: authorElem.textContent
  };
  return {
    author,
    date: cell.innerText.substring(0, cell.innerText.indexOf('\n')),
    href: postElem.getAttribute('href'),
    title: postElem.textContent
  };
};

var BoardCells = /*#__PURE__*/function (BoardCells) {
  BoardCells[BoardCells["Icon"] = 0] = "Icon";
  BoardCells[BoardCells["Info"] = 1] = "Info";
  BoardCells[BoardCells["TopicCount"] = 2] = "TopicCount";
  BoardCells[BoardCells["PostCount"] = 3] = "PostCount";
  BoardCells[BoardCells["LatestPost"] = 4] = "LatestPost";
  return BoardCells;
}(BoardCells || {});

var ForumLinks = /*#__PURE__*/function (ForumLinks) {
  ForumLinks["AdvancedSearch"] = "/f/s";
  ForumLinks["UnreadPosts"] = "/forums.php?action=viewunread";
  ForumLinks["DailyPosts"] = "/forums.php?action=getdaily";
  ForumLinks["Catchup"] = "/f/?catchup";
  return ForumLinks;
}(ForumLinks || {});

var styles = {"forumContent":"forum-module_forumContent__-kYSZ","forumTools":"forum-module_forumTools__zoBo-"};

var _tmpl$ = /*#__PURE__*/template(`<div><h1>My Anonamouse - Forum</h1><div><a>Advanced Search</a><span> | </span><a>New Posts</a><span> | </span><a>Latest Posts (24h.)</a><span> | </span><a>Mark all as read`);
function Forum(props) {
  console.log(props.forumItems);
  return (() => {
    var _el$ = _tmpl$(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling,
      _el$4 = _el$3.firstChild,
      _el$5 = _el$4.nextSibling,
      _el$6 = _el$5.nextSibling,
      _el$7 = _el$6.nextSibling,
      _el$8 = _el$7.nextSibling,
      _el$9 = _el$8.nextSibling,
      _el$10 = _el$9.nextSibling;
    createRenderEffect(_p$ => {
      var _v$ = styles.forumContent,
        _v$2 = styles.forumTools,
        _v$3 = ForumLinks.AdvancedSearch,
        _v$4 = ForumLinks.UnreadPosts,
        _v$5 = ForumLinks.DailyPosts,
        _v$6 = ForumLinks.Catchup;
      _p$.e = style(_el$, _v$, _p$.e);
      _p$.t = style(_el$3, _v$2, _p$.t);
      _v$3 !== _p$.a && setAttribute(_el$4, "href", _p$.a = _v$3);
      _v$4 !== _p$.o && setAttribute(_el$6, "href", _p$.o = _v$4);
      _v$5 !== _p$.i && setAttribute(_el$8, "href", _p$.i = _v$5);
      _v$6 !== _p$.n && setAttribute(_el$10, "href", _p$.n = _v$6);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined,
      n: undefined
    });
    return _el$;
  })();
}
const cloneForum = () => {
  const forumItems = [];
  const tableElem = document.querySelector('#mainForum');
  for (let row of tableElem.tBodies[0].rows) {
    const isCategory = row.cells[0].className === 'colhead';
    if (isCategory) {
      forumItems.push({
        name: row.cells[0].textContent,
        boards: []
      });
      continue;
    }
    forumItems[forumItems.length - 1].boards.push({
      isRead: row.cells[BoardCells.Icon].children[0].getAttribute('alt') === 'unlocked',
      name: row.cells[BoardCells.Info].querySelector('.forumLink').textContent,
      description: row.cells[BoardCells.Info].querySelector('.forDesc').textContent,
      subforums: parseSubforums(row.cells[BoardCells.Info].querySelector('.subBoard')),
      topicCount: parseInt(row.cells[BoardCells.TopicCount].textContent),
      postCount: parseInt(row.cells[BoardCells.PostCount].textContent),
      latestPost: parseLatestPost(row.cells[BoardCells.LatestPost])
    });
  }
  return forumItems;
};

const boardPath = '/f/b';
const threadPath = '/f/t';
const getView = () => {
  const path = window.location.pathname;
  if (path.indexOf(threadPath) >= 0) return ForumViews.THREAD;
  if (path.indexOf(boardPath) >= 0) return ForumViews.BOARD;else return ForumViews.FORUM;
};
const processRouting = async () => {
  const view = getView();
  const mountingElem = await waitForElem('#mainBody');
  switch (view) {
    case ForumViews.FORUM:
      if (mountingElem === null) {
        console.warn('#mainBody did not properly load in time');
        return;
      }
      const forumItems = cloneForum();
      mountingElem.innerHTML = '';
      render(() => createComponent(Forum, {
        forumItems: forumItems
      }), mountingElem);
      break;
  }
};

/**
 * The entry point for the userscript, wrapped in a function to circumvent top-level async/await
 */
const runScript = async () => {
  if (!(await injectStyle(''))) {
    console.warn('Failure to inject stylesheet, quitting');
    return;
  }
  await processRouting();
};
runScript();

})();
})();
