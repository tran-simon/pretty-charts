import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Box, styled } from '@mui/material';
import Chart from 'react-apexcharts';
import ChartProviders, {
  ChartContext,
  ChartPropsContext,
} from '../../providers/ChartProviders';
import { OptionDetails } from '../../components/dataInput/OptionSection';
import apexOptionsModel from '../../model/apexFields/apexOptionsModel';
import { Mosaic, MosaicWindow } from 'react-mosaic-component';

import { MosaicKey } from 'react-mosaic-component/lib/types';
import { useIntlFormatter } from '../../utils/utils';
import './app.css';
import 'react-mosaic-component/react-mosaic-component.css';
import cloneDeep from 'lodash/cloneDeep';
import DataSection from '../../components/dataInput/dataSection/DataSection';

declare module 'react-mosaic-component' {
  /*
   TODO: This is a temporary workaround until react-mosaic-component supports
     @types/react@18 which removed children from the react component props.
     See: https://github.com/nomcopter/react-mosaic/issues/184
   */
  // eslint-disable-next-line unused-imports/no-unused-vars
  export interface MosaicWindowProps<T extends MosaicKey> {
    children: React.ReactNode;
  }
}

type ViewId = 'options-window' | 'chart-window' | 'data-window';

const WindowContent = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
});

const Main = () => {
  const t = useIntlFormatter();
  const windowMap: { [key in ViewId]: ReactNode } = {
    'options-window': (
      <WindowContent overflow="auto" paddingX={2}>
        <OptionDetails Context={ChartContext} options={apexOptionsModel} />
      </WindowContent>
    ),
    'chart-window': (
      <WindowContent>
        <ChartSection />
      </WindowContent>
    ),
    'data-window': (
      <WindowContent>
        {/*TODO*/}
        <DataSection />
      </WindowContent>
    ),
  };

  return (
    <ChartProviders>
      <main>
        <Mosaic<string>
          renderTile={(id, path) => (
            <MosaicWindow<ViewId>
              title={t('window.' + id)}
              path={path}
              toolbarControls={<></>}
            >
              {windowMap[id as ViewId]}
            </MosaicWindow>
          )}
          initialValue={{
            direction: 'row',
            first: 'options-window',
            second: {
              direction: 'column',
              first: 'chart-window',
              second: 'data-window',
              splitPercentage: 60,
            },
            splitPercentage: 30,
          }}
        />
      </main>
    </ChartProviders>
  );
};

const ChartSection = () => {
  const { options: chartProps } = useContext(ChartPropsContext);
  const { options } = useContext(ChartContext);
  const [state, setState] = useState(0);

  useEffect(() => {
    setState((s) => ++s);
  }, [options, chartProps, setState]);

  return (
    <Chart
      key={state} // TODO: This is a temporary workaround to force the chart to re-render an option changes
      options={cloneDeep(options)}
      {...chartProps}
    />
  );
};

export default Main;
