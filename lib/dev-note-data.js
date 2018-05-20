'use babel';

import request from 'request'

let endpoint = 'https://zssqzahlll.execute-api.eu-central-1.amazonaws.com/test'

export default class DevNoteData {
  constructor() {
    this.notes = []
    this.markers = []
  }

  addMarker(id, marker, editor){
    this.markers.push({
      "id": id,
      "marker": marker,
      "editor": editor
    })
  }

  getMarkers(id){
    this.markers = this.markers.filter(item => !item.marker.isDestroyed());

    if(id){
      return this.markers.filter(item => item.id===id);
    }
    return this.markers;
  }

  refrashNotes(callback){
      request(endpoint + '/notes', { json: true }, (err, res) => {
        if (err) { return console.log(err); }
        this.notes = res.body;
        if(callback) callback(this.notes)
      })
  }

  deleteNote(note){
    var options = {
    uri: endpoint + "/notes",
    method: 'DELETE',
    json: true,
    json: {
      "id": note.id,
    }
  };

  request(options, function (error, response, body) {
    if (error || response.statusCode != 200) {
      console.log("request might not be successfull")
    }
  });
  }

  getNotes(){
    return this.notes;
  }
}
