'use babel';

import request from 'request'

let endpoint = 'https://zssqzahlll.execute-api.eu-central-1.amazonaws.com/prod'

export default class DevNoteData {
  constructor() {
    this.notes = []
  }

  refrashNotes(callback){
      request(endpoint + '/notes', { json: true }, (err, res) => {
        if (err) { return console.log(err); }
        this.notes = res.body;
        if(callback) callback(this.notes)
      })
  }

  getNotes(){
    return this.notes;
  }
}
