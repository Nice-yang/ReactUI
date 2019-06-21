import { TagCursor } from '#/common/models/file';
import { actions } from '#/reducers/editor';
import store from '#/store';
import { getIdFromCursor } from '#/utils/fiberNode';
import * as React from 'react';
import {
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor,
} from 'react-dnd';
import { findDOMNode } from 'react-dom';
import * as voidElements from 'void-elements';

class EmptyRef extends React.Component {
  public render() {
    return this.props.children;
  }
}

const dragSource = {
  beginDrag(props: Props) {
    return { cursor: props.cursor };
  },
};

const dragCollect = (
  connect: DragSourceConnector,
  monitor: DragSourceMonitor,
) => ({
  connectDragSource: connect.dragSource(),
  sourceItem: monitor.getItem(),
});

const setOverlayDistinctUntilChanged = (() => {
  let lastCursor: TagCursor | undefined;

  return (cursor?: TagCursor) => {
    if (lastCursor !== cursor) {
      store.dispatch(
        actions.setHoveredOverlay(
          cursor
            ? { id: getIdFromCursor(cursor), source: 'canvas' }
            : undefined,
        ),
      );
    }

    lastCursor = cursor;
  };
})();

const dropTarget = {
  drop(props: Props) {
    if (!voidElements[props.tagName.toLowerCase()]) {
      props.onDrop({ source: props.sourceItem.cursor, target: props.cursor });
    }
  },
  hover(props: Props, monitor: DropTargetMonitor) {
    setOverlayDistinctUntilChanged(monitor.isOver() ? props.cursor : undefined);
  },
};

const dropCollect = (connect: DropTargetConnector) => ({
  connectDropTarget: connect.dropTarget(),
});

type DragCollectProps = ReturnType<typeof dragCollect>;
type DropCollectProps = ReturnType<typeof dropCollect>;

interface Props extends DragCollectProps, DropCollectProps {
  cursor: TagCursor;
  tagName: string;
  onDrop: (p: { source: TagCursor; target: TagCursor }) => void;
}

// tslint:disable-next-line:max-classes-per-file
class Dragify extends React.PureComponent<Props> {
  public render() {
    return (
      <EmptyRef
        ref={(instance: any) => {
          const node = findDOMNode(instance);

          this.props.connectDragSource(node as any);
          this.props.connectDropTarget(node as any);
        }}
      >
        {this.props.children}
      </EmptyRef>
    );
  }
}

export default DragSource('ELEMENT', dragSource, dragCollect)(
  DropTarget('ELEMENT', dropTarget, dropCollect)(Dragify),
);
