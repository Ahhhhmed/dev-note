'use babel';

import DevNoteView from './dev-note-view';
import { CompositeDisposable } from 'atom';

export default {

  devNoteView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.devNoteView = new DevNoteView(state.devNoteViewState);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'dev-note:view-all': () => this.devNoteView.show()
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

};
