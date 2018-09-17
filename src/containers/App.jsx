// @flow

import React from 'react';
import lanesActions from '../redux/actions/lanes';
import { connect } from 'react-redux';
import Lanes from '../components/Lanes/Lanes.jsx';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import type { ILane } from '../types';
import FacebookLogin from 'react-facebook-login';

type Props = {
  lanes: ILane[],
  onCreateLane: Function,
  onDeleteLane: Function,
  onEditLane: Function,
  onMoveLane: Function,
  onReset: Function,
};

const responseFacebook = (response) => {
  console.log(response);
}

class App extends React.Component<*, Props, *> {
  render() {
    return (
      <div>
      <div className="react-kanban">
        <Lanes
          lanes={this.props.lanes}
          onEditLane={this.props.onEditLane}
          onDeleteLane={this.props.onDeleteLane}
          onMoveLane={this.props.onMoveLane}
        />
      </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lanes: state.lanes,
});

const mapDispatchToProps = dispatch => ({
  onCreateLane() {
    dispatch(lanesActions.createLane('Active'));
  },

  onEditLane(laneId, name) {
    const updatedLane: any = {
      id: laneId,
    };

    if (name) {
      (updatedLane: any).name = name;
      (updatedLane: any).editing = false;
    } else {
      (updatedLane: any).editing = true;
    }

    dispatch(lanesActions.updateLane(updatedLane));
  },

  onDeleteLane(laneId) {
    dispatch(lanesActions.deleteLane(laneId));
  },

  onMoveLane(sourceId, targetId) {
    console.log(sourceId,targetId);
    dispatch(lanesActions.move('lane', sourceId, targetId));
    
  },
});

export default DragDropContext(HTML5Backend)(connect(mapStateToProps, mapDispatchToProps)(App));
