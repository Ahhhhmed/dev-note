'use babel';

import SelectListView from 'atom-select-list'


export default class DevNoteFinderView {

  constructor(devNoteData) {
    this.devNoteData = devNoteData
    this.items = [];

    this.selectList = new SelectListView(
      {
        emptyMessage: 'No notes',
        items: [],
        filterKeyForItem: ({keyword, line}) => keyword + " " + line,
        didConfirmSelection: ({marker, editor}) => {
          this.hide()
          atom.workspace.open(editor.getPath())
          editor.setSelectedBufferRange(marker.getBufferRange(), {autoscroll: false})
          editor.scrollToCursorPosition()
          // love
          // fjsdhgtias love
        },
        didCancelSelection: () => {
          this.hide()
        },
        elementForItem: ({line, editor}) => {
          let lineText = line;
          const li = document.createElement('li')
          li.classList.add('dev-note-finder')
          const primaryLine = document.createElement('div')
          primaryLine.classList.add('primary-line')
          primaryLine.textContent = editor.getLongTitle()
          li.appendChild(primaryLine)
          if (lineText) {
            const secondaryLine = document.createElement('div')
            secondaryLine.classList.add('secondary-line')
            secondaryLine.textContent = lineText.trim()
            li.appendChild(secondaryLine)
            li.classList.add('two-lines')
          }
          return li
        }
      })
      this.selectList.element.classList.add('dev-note-view')
  }

  getModalPanel () {
    if (!this.modalPanel) {
      this.modalPanel = atom.workspace.addModalPanel({item: this.selectList})
    }
    return this.modalPanel
  }

  destroy () {
    this.selectList.destroy()
    this.getModalPanel().destroy()
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }

  async show (note) {
    let markers = this.devNoteData.getMarkers(note.id)

    this.previouslyFocusedElement = document.activeElement
    this.selectList.reset()
    this.selectList.update({items: markers})
    await this.getModalPanel().show()
    this.selectList.focus()
  }

  hide () {
    this.getModalPanel().hide()
    if (this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus()
      this.previouslyFocusedElement = null
    }
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}
}
