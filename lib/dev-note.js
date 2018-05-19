'use babel';

import DevNoteView from './dev-note-view';

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
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.devNoteView = new DevNoteView(state.devNoteViewState);
    this.devNoteData = new DevNoteData();

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dev-note:view-all': () => {
        this.devNoteData.refrashNotes((data)=>{
          this.devNoteView.show(data)
        })
      }
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.devNoteView.destroy();
  },

  serialize() {
    return {
      devNoteViewState: this.devNoteView.serialize()
    };
  }

}
