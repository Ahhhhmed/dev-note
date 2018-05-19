'use babel';

import SelectListView from 'atom-select-list'

let mockData = [
  {
    "name": "note1",
    "value": "Make this hack awesome"
  },
  {
    "name": "note2",
    "value": "You look fabulous."
  }
]

export default class DevNoteView {

  constructor() {

    this.selectList = new SelectListView(
      {
        emptyMessage: 'No notes',
        items: [],
        filterKeyForItem: ({name, value}) => name + " " + value,
        didConfirmSelection: (note) => {
          this.hide()
          console.log(note)
        },
        didCancelSelection: () => {
          this.hide()
        },
        elementForItem: ({name, value}) => {
          let lineText = value;
          const li = document.createElement('li')
          li.classList.add('dev-note')
          const primaryLine = document.createElement('div')
          primaryLine.classList.add('primary-line')
          primaryLine.textContent = name
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

  async show () {
    this.previouslyFocusedElement = document.activeElement
    this.selectList.reset()
    await this.selectList.update({items: mockData})
    this.getModalPanel().show()
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
