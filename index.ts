type IFragmentHandler = (fragment: Node) => void
type ISelectorHandlers = [string, (el: Element) => void][]

function getNodes(rootElem: Node, type: number) {
  function filterNone() {
    return NodeFilter.FILTER_ACCEPT
  }

  const comments = []
  const iterator = document.createNodeIterator(rootElem, type, filterNone)

  let curNode

  while ((curNode = iterator.nextNode())) {
    comments.push(curNode)
  }

  return comments
}

const oncopy = (handlers: ISelectorHandlers = [], fragmentHandler?: IFragmentHandler) => {
  window.addEventListener('copy', (event) => {
    if (!event.clipboardData) return

    const selection = document.getSelection()
    if (!selection) return

    const range = selection.getRangeAt(0)
    const fragment = range.cloneContents()

    if (!fragment.textContent.trim()) return

    fragment.querySelectorAll('p > strong').forEach((el) => {
      el.replaceWith(`**${el.textContent.trim()}**`)
    })

    handlers.forEach((handler) => {
      if (!handler[0] || !handler[1]) return

      fragment.querySelectorAll(handler[0]).forEach((el) => {
        handler[1](el)
      })
    })

    if (fragmentHandler) {
      fragmentHandler(fragment)
    }

    const div = document.createElement('div')
    div.append(fragment)

    console.log(div)

    const textContent = div.textContent.trim()
    const textContentFormatted = textContent
      // .replaceAll(/(?<num>\[\d+\])+\s*./gim, '.')
      .replaceAll(/\u0301/g, '')
      .trim()

    event.clipboardData.setData('text/plain', textContentFormatted)
    event.preventDefault()
  })
}

window.extlib = {
  getNodes,
  oncopy,
}
