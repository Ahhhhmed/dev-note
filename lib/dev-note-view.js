'use babel';

import SelectListView from 'atom-select-list'


export default class DevNoteView {

  constructor(devNoteData) {
    this.devNoteData = devNoteData
    this.items = [];

    this.selectList = new SelectListView(
      {
        emptyMessage: 'No notes',
        items: [],
        filterKeyForItem: ({keyword, note}) => keyword + " " + note,
        didConfirmSelection: (note) => {
          this.hide()
          if(this.delete_note_after){
            this.devNoteData.deleteNote(note)
          }
        },
        didCancelSelection: () => {
          this.hide()
        },
        elementForItem: ({keyword, note}) => {
          let lineText = note;
          const li = document.createElement('li')
          li.classList.add('dev-note')
          const primaryLine = document.createElement('div')
          primaryLine.classList.add('primary-line')
          primaryLine.textContent = keyword
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

  async show (notes, delete_note_after) {
    this.delete_note_after = delete_note_after
    this.previouslyFocusedElement = document.activeElement
    this.selectList.reset()
    this.selectList.update({items: notes})
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
