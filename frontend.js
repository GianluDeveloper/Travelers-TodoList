const downloadData = () => {
  let element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' +
      encodeURIComponent(document.getElementById('todo').innerText),
  )
  element.setAttribute('download', 'daPortare.txt')
  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
  return false
}
let lastSave = '',
  working = false
const deleteThis = (el) => {
  el.parentNode.parentNode.remove(el)
  save()
}

const save = (opacize = false) => {
  working = true
  fetch('/api', {
    method: 'POST',
    body: JSON.stringify({
      html: document.getElementById('todo').innerHTML,
    }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(() => {
      if (opacize) document.getElementById('todo').style.opacity = 1
      working = false
    })
    .catch(() => {
      working = false
    })
  if (opacize) document.getElementById('todo').style.opacity = 0.5
}
const update = () => {
  if (document.getElementById('todo').innerHTML != lastSave) return
  fetch('/cached.json')
    .then((j) => j.json())
    .then((data) => {
      if (data.html != document.getElementById('todo').innerHTML)
        document.getElementById('todo').innerHTML = data.html
    })
    .catch((err) => {
      alert('Error loading data')
    })
}
document.ready = () => {
  update()
}

document.getElementById('todoinput').form.onsubmit = () => {
  const fdata = document.getElementById('todoinput')
  let el = document.createElement('li')
  el.className = 'collection-item'
  el.innerHTML =
    ' <div><a onclick="deleteThis(this)" class="btn-floating btn waves-effect waves-light orange">💔</a> <span contenteditable="true">' +
    fdata.value +
    '</span></div>'
  document.getElementById('todo').prepend(el)
  fdata.value = ''
  save(true)
  return false
}
setInterval(() => {
  if (document.getElementById('todo').innerHTML != lastSave) {
    save()
    lastSave = document.getElementById('todo').innerHTML
  } else {
    if (!working) update()
  }
}, 2000)

let selected = null

function dragOver(e) {
  if (isBefore(selected, e.target)) {
    e.target.parentNode.insertBefore(selected, e.target)
  } else {
    e.target.parentNode.insertBefore(selected, e.target.nextSibling)
  }
}

function dragEnd() {
  selected = null
}

function dragStart(e) {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('application/html', null)
  selected = e.target
}

function isBefore(el1, el2) {
  let cur
  if (el2.parentNode === el1.parentNode) {
    for (cur = el1.previousSibling; cur; cur = cur.previousSibling) {
      if (cur === el2) return true
    }
  }
  return false
}
