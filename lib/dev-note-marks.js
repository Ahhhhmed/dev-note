'use babel';

import {CompositeDisposable} from 'atom'

export default class Markers {
  static deserialize (editor, state) {
    return new Markers(editor, editor.getMarkerLayer(state.markerLayerId))
  }

  constructor (editor, markerLayer, devNoteData) {
    this.devNoteData = devNoteData
    this.editor = editor
    this.markerLayer = markerLayer || this.editor.addMarkerLayer({persistent: true})
    this.decorationLayer = this.editor.decorateMarkerLayer(this.markerLayer, {type: "line-number", class: "marked"})
    this.disposables = new CompositeDisposable()
    this.disposables.add(atom.commands.add(atom.views.getView(this.editor), {
      "dev-note:view": this.view.bind(this),
      "dev-note:mark": this.makeMarks.bind(this),
    }))
    this.disposables.add(this.editor.onDidDestroy(this.destroy.bind(this)))

    this.makeMarks();
  }

  destroy () {
    this.deactivate()
    this.markerLayer.destroy()
  }

  deactivate () {
    this.decorationLayer.destroy()
    this.disposables.dispose()
  }

  serialize () {
    return {markerLayerId: this.markerLayer.id}
  }

  view(){

  }

  makeMarks () {
    this.markerLayer.clear()
    let lineCount = this.editor.getLineCount()
    for(var i=0; i<lineCount; i++){
      let line = this.editor.lineTextForBufferRow(i);
      for(const {keyword, id} of this.devNoteData.getNotes()){
        if(line.includes(keyword)){
          let startIndex = line.indexOf(keyword)
          const mark = this.markerLayer.markBufferRange([[i, startIndex], [i, startIndex+keyword.length]], {invalidate: "surround", exclusive: true})
          this.devNoteData.addMarker(id, mark, this.editor)
          this.disposables.add(mark.onDidChange(({isValid}) => {
            if (!isValid) {
              mark.destroy()
            }
          }))
        }
      }
    }
  }

  clearBookmarks () {
    for (const bookmark of this.markerLayer.getMarkers()) {
      bookmark.destroy()
    }
  }

  jumpToNextBookmark () {
    if (this.markerLayer.getMarkerCount() > 0) {
      const bufferRow = this.editor.getLastCursor().getMarker().getStartBufferPosition().row
      const markers = this.markerLayer.getMarkers().sort((a, b) => a.compare(b))
      const bookmarkMarker = markers.find((marker) => marker.getBufferRange().start.row > bufferRow) || markers[0]
      this.editor.setSelectedBufferRange(bookmarkMarker.getBufferRange(), {autoscroll: false})
      this.editor.scrollToCursorPosition()
    } else {
      atom.beep()
    }
  }

  jumpToPreviousBookmark () {
    if (this.markerLayer.getMarkerCount() > 0) {
      const bufferRow = this.editor.getLastCursor().getMarker().getStartBufferPosition().row
      const markers = this.markerLayer.getMarkers().sort((a, b) => b.compare(a))
      const bookmarkMarker = markers.find((marker) => marker.getBufferRange().start.row < bufferRow) || markers[0]
      this.editor.setSelectedBufferRange(bookmarkMarker.getBufferRange(), {autoscroll: false})
      this.editor.scrollToCursorPosition()
    } else {
      atom.beep()
    }
  }

  selectToNextBookmark () {
    if (this.markerLayer.getMarkerCount() > 0) {
      const bufferRow = this.editor.getLastCursor().getMarker().getStartBufferPosition().row
      const markers = this.markerLayer.getMarkers().sort((a, b) => a.compare(b))
      const bookmarkMarker = markers.find((marker) => marker.getBufferRange().start.row > bufferRow)
      if (!bookmarkMarker) {
        atom.beep()
      } else {
        this.editor.setSelectedBufferRange([bookmarkMarker.getHeadBufferPosition(), this.editor.getCursorBufferPosition()], {autoscroll: false})
      }
    } else {
      atom.beep()
    }
  }

  selectToPreviousBookmark () {
    if (this.markerLayer.getMarkerCount() > 0) {
      const bufferRow = this.editor.getLastCursor().getMarker().getStartBufferPosition().row
      const markers = this.markerLayer.getMarkers().sort((a, b) => b.compare(a))
      const bookmarkMarker = markers.find((marker) => marker.getBufferRange().start.row < bufferRow)
      if (!bookmarkMarker) {
        atom.beep()
      } else {
        this.editor.setSelectedBufferRange([this.editor.getCursorBufferPosition(), bookmarkMarker.getHeadBufferPosition()], {autoscroll: false})
      }
    } else {
      atom.beep()
    }
  }
}
