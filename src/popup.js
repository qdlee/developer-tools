class TimestampItem {
  constructor() {
    this._dateString = '';
    this._timestamp = '';
    this.base = 1000;
  }

  get dateString() {
    return this._dateString;
  }

  set dateString(value) {
    this._dateString = value;
    $('#date').value = value;
  }

  get timestamp() {
    return this._timestamp;
  }

  set timestamp(value) {
    this._timestamp = value;
    $('#timestamp').value = value;
  }

  now() {
    const date = new Date();
    this.dateString = dateFormat(date);
    this.timestamp = Math.floor(date.getTime() / this.base);
  }

  timestampToDateString() {
    const timestamp = this.timestamp;
    const date = new Date(timestamp * this.base);
    this.dateString = dateFormat(date);
  }

  dateStringToTimestamp() {
    const dateString = this.dateString;
    const date = new Date(dateString);
    this.timestamp = Math.floor(date.getTime() / this.base);
  }

  timestampInput(e) {
    this.timestamp = e.target.value;
    this.timestampToDateString();
  }

  dateStringInput(e) {
    this.dateString = e.target.value;
    this.dateStringToTimestamp();
  }
}

const item = new TimestampItem();

const actions = {
  runMd5() {
    const text = $('#md5').value;
    if (!text) {
      return;
    }
    let time = $('#md5Time').value || 1;
    let digest = text;
    while (time) {
      digest = MD5(digest);
      time--;
    }
    $('#md5Result').innerHTML = digest;
  },
  base64Encode(e) {
    const text = e.target.value;
    let result = '';
    if (text) {
      digest = btoa(
        encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode('0x' + p1);
        })
      );
    }
    $('#base64Dest').value = digest;
  },
  base64Decode(e) {
    const text = e.target.value;
    let result = '';
    if (text) {
      result = decodeURIComponent(
        atob(text)
          .split('')
          .map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
    }
    $('#base64Source').value = result;
  },
  executeJs(e) {
    const text = $('#js').value;
    if (!text) {
      return;
    }
    eval(text);
  },
  dateStringInput(e) {
    item.dateStringInput(e);
  },
  timestampInput(e) {
    item.timestampInput(e);
  },
  now() {
    item.now();
  },
  toggleMilli(e) {
    const checked = e.target.checked;
    item.base = e.target.checked ? 1 : 1000;
    item.now();
  },
  toggleTab(e) {
    const target = e.target;
    const i = target.getAttribute('index');
    if (target.classList.contains('active')) {
      return;
    }
    const current = $('.tabs .active');
    const ci = current.getAttribute('index');
    current.classList.remove('active');
    target.classList.add('active');
    const contents = $('.tab-content');
    contents[ci].classList.add('hidden');
    contents[i].classList.remove('hidden');
  },
  selectInput(e) {
    e.target.select();
  },
  copy() {
    const isSuccessfull = document.execCommand('copy');
    // if (isSuccessfull) {
    // }
  },
  URIEncode(e) {
    const text = e.target.value;
    let result = '';
    if (text) {
      result = encodeURIComponent(text);
    }
    $('#uriEncoded').value = result;
  },
  URIDecode(e) {
    const text = e.target.value;
    let result = '';
    if (text) {
      result = decodeURIComponent(text);
    }
    $('#uriDecoded').value = result;
  }
};

document.addEventListener('DOMContentLoaded', function(e) {
  item.now();
  on('body', 'click', e => {
    const handler = e.target.getAttribute('@click');
    if (handler && typeof actions[handler] === 'function') {
      actions[handler](e);
    }
  });
  on('body', 'input', e => {
    const handler = e.target.getAttribute('@input');
    if (handler && typeof actions[handler] === 'function') {
      actions[handler](e);
    }
  });
  on('body', 'change', e => {
    const handler = e.target.getAttribute('@change');
    if (handler && typeof actions[handler] === 'function') {
      actions[handler](e);
    }
  });
  on(
    'body',
    'focus',
    e => {
      const handler = e.target.getAttribute('@focus');
      if (handler && typeof actions[handler] === 'function') {
        actions[handler](e);
      }
    },
    true
  );
});

function $(selector) {
  const elements = document.querySelectorAll(selector);
  return elements.length === 1 ? elements[0] : elements;
}

function on(selector, event, handler, useCapture = false) {
  const elements = $(selector);

  if (!elements.length) {
    elements.addEventListener(event, handler, useCapture);
  }
  Array.from(elements).forEach(element => {
    element.addEventListener(event, handler, useCapture);
  });
}

function dateFormat(date) {
  return (
    [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join(
      '-'
    ) +
    ' ' +
    [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join(
      ':'
    )
  );
}

function pad(num) {
  return Number(num) < 10 ? `0${num}` : num;
}
