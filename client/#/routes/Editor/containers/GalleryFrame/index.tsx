import AutoScale from '#/components/AutoScale';
import Isolate from '#/components/Isolate';
import { RootState } from '#/reducers';
import actions from '#/reducers/gallery/actions';
import { Theme } from '#/styled/theme';
import { withTheme } from 'emotion-theming';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { connect } from 'react-redux';
import { pipe } from 'rxjs';

const ONE_SIDE_PADDING = 24;

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

interface Props extends StateProps, DispatchProps {
  theme: Theme;
  width: number;
}

class GalleryFrame extends React.PureComponent<Props> {
  private onFrameReady = ({
    doc,
    element,
  }: {
    doc: Document;
    element: HTMLDivElement;
  }) => {
    this.props.setCanvasInternals({ doc, element });
  };

  public render() {
    const {
      workspace,
      selectedComponent,
      setSelectedComponent,
      theme,
      width,
    } = this.props;

    return (
      <Isolate
        onReady={this.onFrameReady}
        frameStyle={{
          width,
        }}
        wrapperStyle={{
          paddingLeft: ONE_SIDE_PADDING,
          paddingRight: ONE_SIDE_PADDING,
        }}
        injectCSS={
          "@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,600&display=swap');"
        }
      >
        {workspace && (
          <div>
            {workspace.components.map((component, i) => (
              <div style={{ marginTop: 20, marginBottom: 32 }} key={i}>
                <div
                  style={{
                    fontFamily: 'IBM Plex Sans, sans-serif',
                    fontSize: 16,
                    marginLeft: -8,
                    fontWeight: 600,
                  }}
                >
                  {component.title}
                </div>
                <div>
                  {component.instances.map((instance, j) => (
                    <div
                      style={{
                        marginBottom: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                      key={j}
                    >
                      <div
                        style={{
                          fontFamily: 'IBM Plex Sans, sans-serif',
                          fontSize: 16,
                          marginBottom: 5,
                          alignSelf: 'flex-end',
                          borderBottom:
                            selectedComponent[0] === i &&
                            selectedComponent[1] === j
                              ? `2px solid ${theme.colors.primary}`
                              : '2px solid transparent',
                          cursor: 'pointer',
                        }}
                        onClick={() => setSelectedComponent([i, j])}
                      >
                        {instance.title}
                      </div>
                      <AutoScale
                        maxWidth={width - ONE_SIDE_PADDING * 2}
                        childRef={console.log}
                      >
                        <div
                          style={{
                            display: 'inline-block',
                            border: '1px solid rgba(0, 0, 0, 0.3)',
                            userSelect: 'none',
                          }}
                          dangerouslySetInnerHTML={{
                            __html: ReactDOMServer.renderToStaticMarkup(
                              instance.element,
                            ),
                          }}
                        />
                      </AutoScale>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Isolate>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  workspace: state.gallery.workspace,
  selectedComponent: state.gallery.selectedComponent,
});

const mapDispatchToProps = {
  setCanvasInternals: actions.setCanvasInternals,
  setSelectedComponent: actions.setSelectedComponent,
};

export default pipe(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withTheme,
)(GalleryFrame);
