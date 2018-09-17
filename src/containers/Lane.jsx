// @flow

import Lane from '../components/Lane.jsx';
import lanesActions from '../redux/actions/lanes';
import notesActions from '../redux/actions/notes';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import * as itemTypes from '../constants/itemTypes';

const { TelegramClient } = require('messaging-api-telegram');
const client = TelegramClient.connect('498533:eed7cac061296effa7c1bcf478b287a0');

client.getWebhookInfo().catch(error => {
  console.log(error); // formatted error message
  console.log(error.stack); // error stack trace
  console.log(error.config); // axios request config
  console.log(error.request); // HTTP request
  console.log(error.response); // HTTP response
});


const laneSource = {
  beginDrag(props) {
    const item = {
      id: props.lane.id,
    };

    return item;
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  },
};

const laneTarget = {
  hover(targetProps, monitor) {
    const targetId = targetProps.lane.id;
    const sourceProps = monitor.getItem();
    const sourceId = sourceProps.id;
    const sourceType = monitor.getItemType();
    console.log(targetProps.lane.name, sourceProps);
    if (!targetProps.lane.notes.length && sourceType === itemTypes.NOTE) {
      targetProps.attachToLane(targetId, sourceId);
    } else if (targetId !== sourceId && sourceType === itemTypes.LANE) {
      targetProps.onMoveLane(sourceId, targetId);
    }
  },
};

const collectDragSource = (DnDconnect, monitor) => ({
  connectDragSource: DnDconnect.dragSource(),
  connectDragPreview: DnDconnect.dragPreview(),
  isDragging: monitor.isDragging(),
});

const collectDropTarget = DnDconnect => ({
  connectDropTarget: DnDconnect.dropTarget(),
});

const mapStateToProps = state => ({
  allNotes: state.notes,
});

const mapDispatchToProps = dispatch => ({
  onCreateNote(laneId) {
    const newNote = notesActions.createNote('New note');
    dispatch(newNote);
    dispatch(lanesActions.attachToLane(laneId, newNote.payload.id));
  },

  // Used both to detach a note from a lane and delete all the notes when a
  // lane is removed
  onDeleteNote(laneId, noteId) {
    dispatch(notesActions.deleteNote(noteId));

    if (laneId) {
      dispatch(lanesActions.detachFromLane(laneId, noteId));
    }
  },

  onEditNote(noteId, value) {
    const updatedNote: any = {
      id: noteId,
    };

    if (value) {
      updatedNote.text = value;
      updatedNote.editing = false;
    } else {
      updatedNote.editing = true;
    }

    dispatch(notesActions.updateNote(updatedNote));
  },

  onMoveNote(sourceId, targetId) {
    client.sendMessage("@campin345", 'hi', {
      disable_web_page_preview: true,
      disable_notification: true,
    });
    //console.log("move" + targetId, sourceId);
    dispatch(lanesActions.move('note', sourceId, targetId));
  },

  attachToLane(laneId, noteId) {
    //console.log("attatch:"+laneId +" note:  "+ noteId);
    dispatch(lanesActions.attachToLane(laneId, noteId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(
  DragSource(itemTypes.LANE, laneSource, collectDragSource)(
    DropTarget([itemTypes.NOTE, itemTypes.LANE], laneTarget, collectDropTarget)(Lane)
  )
);
