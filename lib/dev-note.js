'use babel';

import DevNoteView from './dev-note-view';
import Markers from './dev-note-marks';
import DevNoteData from './dev-note-data';

import { CompositeDisposable } from 'atom';

// let mockData = [
//   {
//     "keyword": "note1",
//     "note": "Make this hack awesome"
//   },
//   {
//     "keyword": "note2",
//     "note": "You look fabulous."
//   }
// ]

export default {

  devNoteView: null,
  // modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.devNoteData = new DevNoteData();
    this.devNoteView = new DevNoteView(this.devNoteData);
    watchedEditors = new WeakSet();
    disposables = new CompositeDisposable();

    atom.workspace.observeTextEditors((textEditor) => {
      if(watchedEditors.has(textEditor)) return;

      marks = new Markers(textEditor, undefined, this.devNoteData)
      watchedEditors.add(textEditor)

      disposables.add(textEditor.onDidDestroy(()=>{
        marks.destroy()
        watchedEditors.delete(textEditor)
      }))
    })

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dev-note:view-notes': () => {
        this.devNoteData.refrashNotes((data)=>{
          this.devNoteView.show(data)
        })
      },
      'dev-note:delete-note': ()=>{
        this.devNoteData.refrashNotes((data)=>{
          this.devNoteView.show(data, true)
        })
      }
    }));
  },

  deactivate() {
    // this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.devNoteView.destroy();
  },

  serialize() {
    return {
      devNoteViewState: this.devNoteView.serialize()
    };
  }

}
